const Express = require("express");
const express = Express.Router();
const fs = require("fs");
const path = require("path");

const LAWINSERVER_PATH = process.env.LAWINSERVER ?? "LawinServer";
const preProcessRequest = (req, filename) => {
    const { accountId } = req.params;

    const ProfilesFolder = path.join(LAWINSERVER_PATH, accountId, "responses");

    if(!fs.existsSync(ProfilesFolder)) {
        fs.mkdirSync(ProfilesFolder, { recursive: true });
    }

    const ProfileFilePath = path.join(ProfilesFolder, filename);

    if(!fs.existsSync(ProfileFilePath)) {
        fs.copyFileSync(path.join("responses", filename), ProfileFilePath);
    }

    const profile = JSON.parse(
        fs.readFileSync(ProfileFilePath)
    );

    return {accountId, ProfilesFolder, ProfileFilePath, profile};
}

express.get("/fortnite/api/game/v2/privacy/account/:accountId", async (req, res) => {
    const { profile: privacy } = preProcessRequest(req, "privacy.json");

    privacy.accountId = req.params.accountId;

    res.json(privacy);
})

express.post("/fortnite/api/game/v2/privacy/account/:accountId", async (req, res) => {
    const { profile: privacy, ProfileFilePath: privacyFilePath } = preProcessRequest(req, "privacy.json");

    privacy.accountId = req.params.accountId;
    privacy.optOutOfPublicLeaderboards = req.body.optOutOfPublicLeaderboards;

    fs.writeFileSync(privacyFilePath, JSON.stringify(privacy, null, 2));

    res.json(privacy);
    res.end();
})

module.exports = express;