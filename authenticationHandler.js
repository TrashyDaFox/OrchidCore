// first file!
const crypto = require("node:crypto");

class OrchidAuthentication {
    static authVersion = 1;
    static compatible = [1];

    static createIdentity(displayName) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048, // key size
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            },
        });

        let pub = OrchidAuthentication.b64encode(publicKey);
        let priv = OrchidAuthentication.b64encode(privateKey);

        let identityData = {pub, priv, disp: OrchidAuthentication.b64encode(displayName)};

        return `ORCHID.ID.${OrchidAuthentication.authVersion}.` + (OrchidAuthentication.b64encode(JSON.stringify(identityData)));
    }
    static b64encode(str) {
        return Buffer.from(str).toString("base64")
    }
    static b64decode(b64) {
        return Buffer.from(b64, "base64").toString("utf-8")
    }
    static validatePublicKey(pubKey) {
        try {
            crypto.createPublicKey(pubKey)
            return true;
        } catch {
            return false;
        }
    }
    static validatePrivateKey(privKey) {
        try {
            crypto.createPrivateKey(privKey)
            return true;
        } catch {
            return false;
        }
    }
    static generateChallenge() {
        return crypto.randomBytes(32).toString('base64')
    }
    static signChallenge(challenge, privKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(challenge);
        sign.end();
        sign.sign(privKey, 'base64')
    }
    static verifyChallenge(challenge, signature, pubKey) {
        const verify = crypto.createVerify('SHA256');
        verify.update(challenge);
        verify.end();
        return verify.verify(pubKey, signature, 'base64');
    }
    static validateIdentity(identityString) {
        if(typeof identityString !== "string") return null;
        if(!identityString.startsWith(`ORCHID.ID.`)) return null;
        let versionString = identityString.substring(`ORCHID.ID.`.length).split('.')[0];
        let version = parseInt(versionString);
        if(isNaN(version)) return null;
        if(!OrchidAuthentication.compatible.includes(version)) return null;

        try {
            let contents = identityString.substring(`ORCHID.ID.`.length + 1 + versionString.length);
            let decodedContents = JSON.parse(OrchidAuthentication.b64decode(contents));

            if(!decodedContents.priv || typeof decodedContents.priv !== "string" || !OrchidAuthentication.validatePrivateKey(OrchidAuthentication.b64decode(decodedContents.priv))) return null;
            if(!decodedContents.pub || typeof decodedContents.pub !== "string" || !OrchidAuthentication.validatePublicKey(OrchidAuthentication.b64decode(decodedContents.pub))) return null;

            return {
                pub: OrchidAuthentication.b64decode(decodedContents.pub),
                priv: OrchidAuthentication.b64decode(decodedContents.priv),
                disp: OrchidAuthentication.b64decode(decodedContents.disp),
                version
            }
        } catch {
            return null;
        }
    }
}

module.exports = OrchidAuthentication;