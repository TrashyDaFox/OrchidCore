const OrchidAppStore = require("../AppStore");
const OrchidAuthentication = require("../authenticationHandler");

let args = process.argv.slice(2);

if(args.length) {
    let res = OrchidAppStore.writeProfile(
        OrchidAuthentication.createIdentity(args[0])
    )
    console.log(res ? `Created profile successfully!` : `Profile not created...`)
} else {
    console.log("Please include a name!")
}