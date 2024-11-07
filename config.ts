import dotenv from "dotenv";
import cfg from "./config.json";
dotenv.config();

let { BEACON_CLIENT_ID, BOT_TOKEN } = process.env;
if (!BEACON_CLIENT_ID || !BOT_TOKEN) {
	console.log(`MISSING ENVIRONMENT VARIABLES!`);
}

export default {
	botToken: BOT_TOKEN!,
	beaconClientId: BEACON_CLIENT_ID!,
	beaconRedirectUri: "http://localhost/oauth",
	beaconLoginUri: "https://api.usebeacon.app/v4/login",
	beaconUserUri: "https://api.usebeacon.app/v4/user",
	sharding: cfg.sharding,
	colours: cfg.colours
};
