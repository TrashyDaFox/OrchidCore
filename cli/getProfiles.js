const OrchidAppStore = require("../AppStore");
const OrchidAuthentication = require("../authenticationHandler");

let profiles = OrchidAppStore.getProfiles();
if(profiles.length) {
    console.log(`- ${profiles.map(_=>`${_.disp} (Orchid V${_.version})`).join('\n- ')}`);
} else {
    console.log(`No profiles yet!`)
}