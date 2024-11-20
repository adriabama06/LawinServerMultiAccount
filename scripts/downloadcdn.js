const path = require("path");
const fs = require("fs");
const stream = require("stream");

/**
 * Used to download from:
 * ..\responses\contentpages.json
 * ..\responses\Athena\motd.json
 * ..\responses\Athena\sparkTracks.json
 * ..\responses\Athena\Discovery\discovery_frontend.json
 * ..\structure\functions.js
 */

const filepath = process.argv[2];

if(!filepath) {
    console.log(`${process.argv[0]} ${process.argv[1]} "file.json"`);
    process.exit();
}

if(!fs.existsSync(filepath)) {
    console.log(`${filepath} file not found, try to use an absolute path`);
    process.exit();
}

const EXTENSIONS = ["png", "jpg", "dat", "lad"];

/**
 * @returns {Promise<boolean>}
 * @param {string} url 
 * @param {string} file 
 */
function downloadFile(url, file) {
    return new Promise(async (resolve) => {
        const resp = await fetch(url);

        if (resp.ok && resp.body) {
            var writer = fs.createWriteStream(file);
            stream.Readable.fromWeb(resp.body)
            .pipe(writer)
            .on("finish", () => resolve(true));
        } else {
            resolve(false);
        }
    });
}

/**
 * @returns {string[]}
 * @param {string} content 
 */
function extractUrls(content) {
    const urls = [];

    const pattern = "https://";

    for(var i = 0; i < (content.length - pattern.length); i++) {
        const chunk = content.slice(i, i + pattern.length);

        if(chunk != pattern) continue;

        const url = content.slice(i, content.indexOf("\"", i));

        if(!EXTENSIONS.find(ext => url.toLowerCase().endsWith(ext))) continue;

        if(urls.includes(url)) continue;

        urls.push(url);
    }

    return urls
}

const urls = extractUrls(
    fs.readFileSync(filepath).toString()
);

(async () => {
    for(var i = 0; i < urls.length; i++) {
        const url = urls[i];
    
        const route = new URL(url).pathname;
    
        const file = path.join(__dirname, "..", "cdn", route);
    
        if(!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
    
        console.log(`[${i + 1}/${urls.length}] Downloading ${url}`);
    
        const status = await downloadFile(url, file);

        if(!status) console.log(`[${i + 1}/${urls.length}] Error on download ${url}`);
    }
})();