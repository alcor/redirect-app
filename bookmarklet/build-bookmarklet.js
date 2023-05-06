#! node
const { execSync } = require("child_process");
const fs = require('fs');

execSync('terser bookmarklet.js > bookmarklet.min.js')

let data = fs.readFileSync('bookmarklet.min.js', 'utf8');
let title = "Create-Redirect-Link"
let description = "Make-redirect-links-to-any-page-with-a-custom-title-and-description"
let emoji = "%F0%9F%94%97"
let b_title = "Make%20Redirect"
let url = `https://itty.bitty.app/${title}/d/${description}/f/${emoji}/#${b_title}/javascript:` + encodeURIComponent(data);
let shortcut = `[InternetShortcut]
URL=` + url

fs.writeFileSync("bookmarklet.url",shortcut)
fs.writeFileSync("../docs/bookmarklet.html", `<meta http-equiv="Refresh" content="0; url='${url}'" />`

)




