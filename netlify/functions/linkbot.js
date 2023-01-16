const tweetnacl = require('tweetnacl')

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  console.log(event)
  try {
    if (event.httpMethod == "POST") {
      return handleInteraction(event)
    } else {
      return { statusCode: 200, body: "OK"}
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }


let handleInteraction = (event) => {
  const PUBLIC_KEY = '0e8ab4ac84290450f737c1aeba53bf5fe2640a2ce5ab2f540ee9294d91833ee2';

  const signature = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];
  const isVerified = tweetnacl.sign.detached.verify(
    Buffer.from(timestamp + event.body),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  ) || event.rawUrl.startsWith("http://");
  
  let headers = {'Content-Type': 'application/json'}; 
  
  if (!isVerified) {
    console.log("> invalid request signature")
    return {statusCode: 401, headers, body: JSON.stringify({"type": 1})}
  } else {
    let json = JSON.parse(event.body);
    if (json.type == 1) {
      return {statusCode: 200, headers, body: JSON.stringify({"type": 1})}
    }
    return handleCommand(event, json)
  }
}

let handleCommand = (event, json) => {
  let user = json.user;
  let action = json.data.name;
  let options = Object.fromEntries(json.data.options.map(o => [o.name, o.value]));

  console.log("Interaction: ", JSON.stringify(json))
  let url = options.url
  if (!url.includes(":")) url = "https://" + options.url

  let urlinfo = new URL(url)
  let title = options.title || url || "Untitled"
  if (title.length > 28) title = title.substring(0, 28) + "..."
  
  let description = options.description

  let reply = {type: 4}

  let embed = description?.length > 0 || action == "embed";  
  if (embed) {
    let content = { title: "__" + title + "__", url, description }
    content.color = 2844376;
    content.footer = {
        text:urlinfo.host
        // icon_url:  `https://www.google.com/s2/favicons?domain=${urlinfo.host}&sz=${32}`
      }

    console.log("author:", options.author)
    if (options.author == "me") {
      content.author = {
        name: user?.username,
        icon_url:`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.webp?size=32`
      }
    } else if (options.author) {
      content.author = { name: options.author }
    }
    
    if (options.thumbnail) content.thumbnail = {url: options.thumbnail}
    if (options.image) content.image = {url: options.image}
    if (options.video) content.video = {url: options.video}
    
    if (options.fields) {
      try {
        let dict = JSON.parse(`{${options.fields}}`)
        if (options.fields.length) content.fields = Object.entries(dict).map(([name, value]) => ({name, value, "inline":true}))
      } catch (e) {console.log("Field error", e, `{${options.fields}}`)}
    }
  

    reply.data = {embeds:[content]}
  } else {
    reply.data = {content: `__[${title}](${url})__`};
  }
  
  
  
  reply = JSON.stringify(reply)
  console.log("REPLY", reply);
  let headers = {'Content-Type': 'application/json'}; 
  return  {statusCode: 200, headers, body: reply}
}
