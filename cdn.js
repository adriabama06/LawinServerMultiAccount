const Express = require("express");
const path = require("path");
const fs = require("fs");

const app = Express.Router();

const EXTENSIONS = ["png", "jpg", "dat", "lad"];

// Use local cdn to make sure total a offline server that does not require epicgame's server to work
// This will help with the preservation of the game
app.use(async (req, res, next) => {
    const isAFile = (() => {
        const dotSplit = req.url.split(".");

        return EXTENSIONS.includes(dotSplit[dotSplit.length - 1].toLowerCase());
    })();

    if(!isAFile) return next();

    // __dirname required for absoulte path for express sendFile();
    const filePath = path.join(__dirname, "cdn", req.url);

    if(!fs.existsSync(filePath)) return next();

    return res.sendFile(filePath);
});

module.exports = app;
