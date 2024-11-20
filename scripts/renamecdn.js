const path = require("path");
const fs = require("fs");

/**
 * Used to convert from:
 * ..\responses\contentpages.json
 * ..\responses\Athena\motd.json
 * ..\responses\Athena\sparkTracks.json
 * ..\responses\Athena\Discovery\discovery_frontend.json
 * ..\structure\functions.js
 */

const public_ip = process.argv[2];
const filepath = process.argv[3];

if (!filepath) {
    console.log(`${process.argv[0]} ${process.argv[1]} "public_ip" "file.json"\n\nExample: ${process.argv[0]} ${process.argv[1]} "http://192.168.1.1:3551" "../responses/contentpages.json"`);
    process.exit();
}

if (!fs.existsSync(filepath)) {
    console.log(`${filepath} file not found, try to use an absolute path`);
    process.exit();
}

const EXTENSIONS = ["png", "jpg", "dat", "lad"];

/**
 * @returns {string[]}
 * @param {string} content 
 */
function extractUrls(content) {
    const urls = [];

    const pattern = "https://";

    for (var i = 0; i < (content.length - pattern.length); i++) {
        const chunk = content.slice(i, i + pattern.length);

        if (chunk != pattern) continue;

        const url = content.slice(i, content.indexOf("\"", i));

        if (!EXTENSIONS.find(ext => url.toLowerCase().endsWith(ext))) continue;

        if (urls.includes(url)) continue;

        urls.push(url);
    }

    return urls
}

var filecontent = fs.readFileSync(filepath).toString();

const urls = extractUrls(filecontent);

for (var i = 0; i < urls.length; i++) {
    const url = urls[i];

    const origin = new URL(url).origin;

    const new_url = url.replace(origin, public_ip);

    filecontent = filecontent.replaceAll(url, new_url);
}

fs.writeFileSync(filepath, filecontent);