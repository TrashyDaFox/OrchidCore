const fs = require("node:fs");
const os = require("node:os");
const process = require("node:process");
const path = require('node:path')
const OrchidAuthentication = require("./authenticationHandler");

class OrchidAppStore {
    static appPath = "orchid-core";

    static getUserDataPath(appName = OrchidAppStore.appPath) {
        let basePath;

        switch (process.platform) {
            case "win32":
                basePath = process.env.APPDATA;
                break;
            case "darwin":
                basePath = path.join(
                    os.homedir(),
                    "Library",
                    "Application Support"
                );
                break;
            default: // Linux + others
                basePath =
                    process.env.XDG_CONFIG_HOME ||
                    path.join(os.homedir(), ".config");
                break;
        }

        return appName ? path.join(basePath, appName) : basePath;
    }

    static writeProfile(identityString) {
        let data = OrchidAuthentication.validateIdentity(identityString)
        if(!data) return false;
        let appDataPath = OrchidAppStore.getUserDataPath();
        let identitiesPath = path.join(appDataPath, 'identities');
        try { fs.mkdirSync(identitiesPath, {recursive: true}); } catch {return false}
        fs.writeFileSync(path.join(identitiesPath, `${data.disp}.orchid`), identityString);
        return true;
    }

    static deleteProfile(name) {
        try {
            let appDataPath = OrchidAppStore.getUserDataPath();
            let identitiesPath = path.join(appDataPath, 'identities');
    
            fs.unlinkSync(path.join(identitiesPath, `${name}.orchid`));
            return true;
        } catch {
            return false;
        }
    }

    static getProfiles(name) {
        try {
            let appDataPath = OrchidAppStore.getUserDataPath();
            let identitiesPath = path.join(appDataPath, 'identities');
    
            let profiles = [];
            let files = fs.readdirSync(identitiesPath)
            for(const file of files) {
                let identityString = fs.readFileSync(path.join(identitiesPath, file)).toString();
                let data = OrchidAuthentication.validateIdentity(identityString);
                if(data) profiles.push(data)
            }
            return profiles;
        } catch {
            return [];
        }
    }
}

module.exports = OrchidAppStore;