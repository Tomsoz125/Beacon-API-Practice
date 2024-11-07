import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";
import config from "../../../config.ts";
import { db } from "../../../db";
import { getCurrentKeysHex } from "../../../encryption";
import generateCodeChallenge from "./generateCodeChallenge";

const beaconLoginQuery =
	"?state={client-generated-state}&client_id={client-id}&scope=common%20users.private_key%3Aread%20users%3Aread&redirect_uri={redirect-uri}&response_type=code&code_challenge={client-generated-challenge}&code_challenge_method=S256&public_key={client-generated-rsa-public-key}";

export = async (userId: string) => {
	const { publicKey } = getCurrentKeysHex();
	let attemptCount = 0;
	const maxAttempts = 5;

	while (attemptCount < maxAttempts) {
		const challenge = generateCodeChallenge();
		const state = uuidv4();

		try {
			await db.codeChallenge.create({
				data: {
					challenge: challenge.base64,
					challengeVerifier: challenge.verifier,
					state
				}
			});

			// If insert is successful, return the data
			return {
				challenge: challenge.base64,
				challenge_verifier: challenge.verifier,
				state,
				url: `${config.beaconLoginUri}${beaconLoginQuery
					.replace("{client-generated-state}", state)
					.replace("{client-generated-rsa-public-key}", publicKey)
					.replace("{client-id}", config.beaconClientId)
					.replace("{client-generated-challenge}", challenge.base64)
					.replace(
						"{redirect-uri}",
						encodeURI(config.beaconRedirectUri)
					)
					.replace(/\n/g, "")}`
			};
		} catch (error: any) {
			if (
				// Adjust the error checking based on your ORM and database
				error instanceof PrismaClientKnownRequestError &&
				error.code === "P2002" // Unique constraint failed
			) {
				// Duplicate key error, increment attempt count and retry
				attemptCount++;
				continue;
			} else {
				// Re-throw any other errors
				throw error;
			}
		}
	}

	throw new Error(
		"Unable to generate unique code challenge after multiple attempts"
	);
};
