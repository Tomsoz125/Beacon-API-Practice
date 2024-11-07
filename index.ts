import { AccessToken } from "@prisma/client";
import * as readline from "readline";
import config from "./config.ts";
import createAccessToken from "./database/accessTokens/createAccessToken";
import fetchAccessTokenByUserId from "./database/accessTokens/getAccessTokenByUserId";
import updateAccessToken from "./database/accessTokens/updateAccessToken";
import createBeaconUser from "./database/users/createBeaconUser";
import getBeaconUserById from "./database/users/getBeaconUserById";
import updateBeaconUserById from "./database/users/updateBeaconUserById";
import { db } from "./db";
import { sendGetRequest, sendPostRequest } from "./http";

let accessTokens: AccessToken[] = [];

function askQuestion(query: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => rl.question(query, resolve));
}

async function getBeaconAccessToken(guilds: string[]) {
	const state = await askQuestion("What is the request state? ");
	const codes = await db.codeChallenge.delete({ where: { state } });
	if (!codes) {
		console.log(
			`Request authorization failed! Failed to find challenge info from state ${state}!`
		);
		return;
	}
	const code = await askQuestion("What is the request code? ");
	const requestBody = {
		client_id: config.beaconClientId,
		code,
		grant_type: "authorization_code",
		redirect_uri: config.beaconRedirectUri,
		code_verifier: codes.challengeVerifier
	};
	const response = await sendPostRequest(config.beaconLoginUri, requestBody);

	const user = await sendGetRequest(
		config.beaconUserUri,
		`${response.token_type} ${response.access_token}`
	);

	const existingToken = await fetchAccessTokenByUserId(user.userId);
	if (existingToken) {
		var accessToken = await updateAccessToken(
			existingToken.id,
			user.userId,
			response
		);
	} else {
		var accessToken = await createAccessToken(user.userId, response);
	}
	accessTokens.push(accessToken);

	if (!(await getBeaconUserById(user.userId))) {
		await createBeaconUser(user, guilds, accessToken.id);
	} else {
		await updateBeaconUserById(user.userId, user, accessToken.id, guilds);
	}
}

function removeAccessTokenById(id: number) {
	accessTokens = accessTokens.filter((a) => a.id !== id);
}

async function refreshBeaconToken(
	id: number,
	refresh_token: string,
	scope: string
) {
	const requestBody = {
		grant_type: "refresh_token",
		client_id: config.beaconClientId,
		refresh_token,
		scope
	};

	const response = await sendPostRequest(config.beaconLoginUri, requestBody);
	const user = await sendGetRequest(
		config.beaconUserUri,
		`${response.token_type} ${response.access_token}`
	);

	const newToken = await updateAccessToken(id, user.userId, response);
	removeAccessTokenById(id);
	accessTokens.push(newToken);

	await updateBeaconUserById(user.userId, user, newToken.id);
}

setInterval(async () => {
	for (const token of accessTokens) {
		if (new Date() > token.refreshTokenExpires) {
			console.log(`Token ${token.id}'s refresh token has expired!`);
			await db.accessToken.delete({ where: { id: token.id } });
			removeAccessTokenById(token.id);
			const otherTokens = await db.accessToken.findMany({
				where: { userId: token.userId }
			});
			if (!otherTokens || otherTokens.length < 1) {
				await db.beaconUser.delete({ where: { userId: token.userId } });
			}
			continue;
		}

		if (new Date() > token.accessTokenExpires) {
			console.log(
				`Token ${token.id} has expired, attempting to refresh!`
			);
			await refreshBeaconToken(token.id, token.refreshToken, token.scope);
		}
	}
}, 5000);

// TODO: Migrate this functionality to discord
// TODO: Make it so it has a state of a v4 uuid and then -- then the user id

if (config.sharding.enabled) {
	require("./src/sharding");
} else {
	require("./src/bot");
}
