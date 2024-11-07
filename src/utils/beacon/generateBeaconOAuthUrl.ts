import { v4 as uuidv4 } from "uuid";
import config from "../../../config.ts";
import { db } from "../../../db";
import { getCurrentKeysHex } from "../../../encryption";
import generateCodeChallenge from "./generateCodeChallenge";

const beaconLoginQuery =
	"?state={client-generated-state}&client_id={client-id}&scope=common%20users.private_key%3Aread%20users%3Aread&redirect_uri={redirect-uri}&response_type=code&code_challenge={client-generated-challenge}&code_challenge_method=S256&public_key={client-generated-rsa-public-key}";

export = async (userId: string) => {
	const { publicKey } = getCurrentKeysHex();
	const challenge = await generateCodeChallenge();
	const state = `${uuidv4()}`;
	await db.codeChallenge.create({
		data: {
			challenge: challenge.codeChallenge,
			challengeVerifier: challenge.codeVerifier,
			state
		}
	});
	console.log({
		challenge: challenge.codeChallenge,
		challenge_verifier: challenge.codeVerifier,
		state,
		url: `${config.beaconLoginUri}${beaconLoginQuery
			.replace("{client-generated-state}", state)
			.replace("{client-generated-rsa-public-key}", publicKey)
			.replace("{client-id}", config.beaconClientId)
			.replace("{client-generated-challenge}", challenge.codeChallenge)
			.replace("{redirect-uri}", encodeURI(config.beaconRedirectUri))
			.replace(/\n/g, "")}`
	});
	return {
		challenge: challenge.codeChallenge,
		challenge_verifier: challenge.codeVerifier,
		state,
		url: `${config.beaconLoginUri}${beaconLoginQuery
			.replace("{client-generated-state}", state)
			.replace("{client-generated-rsa-public-key}", publicKey)
			.replace("{client-id}", config.beaconClientId)
			.replace("{client-generated-challenge}", challenge.codeChallenge)
			.replace("{redirect-uri}", encodeURI(config.beaconRedirectUri))
			.replace(/\n/g, "")}`
	};
};
