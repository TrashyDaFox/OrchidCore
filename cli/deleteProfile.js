const OrchidAppStore = require("../AppStore");
const OrchidAuthentication = require("../authenticationHandler");

let args = process.argv.slice(2);

if(args.length) {
    let res = OrchidAppStore.deleteProfile(args[0]);
    console.log(res ? `Successfully deleted profile` : `Couldn't delete profile...`)
} else {
    console.log("Please include a name!")
}