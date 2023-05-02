

(() => {

  let dashspaces = (s) => s.replace(/ +/g, " ").replace(/--/g, "—"/*em*/).replace(/-/g, "--").replace(/ -- /g, "_-_").replace(/ /g, "-");
  let spacedashes = (s) => s.replace(/-/g, " ").replace(/  /g, "-").replace(/ -- /g, "_-_").replace(/ /g, "-");

  function encodePrettyComponent(s) {
    let replacements = {' - ': '---', '-': '--', ' ' : '-'}
    let re = new RegExp('(' + Object.keys(replacements).join('|') + ')', 'g');
    return encodeURIComponent(s.replace(re, e => replacements[e] ?? '-'))
      // .replace(/\%2C/g, ",")
      .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
  }

  function metadataToPath(data) {
    if (!data || !data.title) return "/";
    let path = ["/" + encodePrettyComponent(data.title)];
    if (data.description) path.push("d/" + encodePrettyComponent(data.description.substring(0,200).split(". ").shift()));
    if (data.favicon) path.push("f/" + encodeURIComponent(data.favicon));
    if (data.url) path.push("u/" + encodeURIComponent(btoa(data.url).replace(/=/g, "")));
    if (data.image) path.push("i/" + encodeURIComponent(btoa(data.image).replace(/=/g, "")));
    return path.join('/') + "/";
  }

  let data = {}
  data.title = document.querySelector('meta[property="og:title"]').content
  data.image = document.querySelector('meta[property="og:image"]').content
  data.description = document.querySelector('meta[property="og:description"]').content
  data.url = document.querySelector('meta[property="og:url"]').content
  // data.favicon = document.querySelector('link[rel="icon"]').href
  let url = "https://redirect.app/m" + metadataToPath(data) + "#" + location.href
  
  console.log("Path", url)

}) ()

