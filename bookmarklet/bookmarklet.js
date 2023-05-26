(() => {

  let data = {}
  data.t = document.querySelector('meta[property="og:title"]')?.content || document.title
  data.i = document.querySelector('meta[property="og:image"]')?.content
  data.d = document.querySelector('meta[property="og:description"]')?.content
  data.u = document.querySelector('meta[property="og:url"]')?.content || location.href
  data.f =  [...document.querySelectorAll('link[rel="icon"]')].sort((a,b) => {
    console.log("a", a.getAttribute("sizes"))
    return parseInt(b.getAttribute("sizes").split("x").shift()) - parseInt(a.getAttribute("sizes").split("x").shift())
  }).shift()?.href

  Object.keys(data).forEach((k) => data[k] == null && delete data[k]); // Remove null values
  let params = new URLSearchParams(data)
  console.log("params", params.toString().replace("&", "/").replace(/=/g, "/"))

  let url = "https://redirect.app/edit?" + params.toString() + "#" + location.href
  
  console.log("Path", url)

}) ()

