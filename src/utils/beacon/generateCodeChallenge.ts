import { createHash } from "crypto";
import { db } from "../../../db";
import base64UrlEncode from "./base64UrlEncode";
import generateCodeVerifier from "./generateCodeVerifier";

export = async (): Promise<{ challengeHash: string; verifier: string }> => {
	let verifier;
	let challenge: string;

	const challenges = await db.codeChallenge.findMany();
	do {
		verifier = generateCodeVerifier();
		const hash = createHash("sha256");
		hash.update(verifier);
		const codeVerifierHash = hash.digest();
		challenge = base64UrlEncode(codeVerifierHash);
	} while (challenges.find((ch) => ch.challenge === challenge));

	return { challengeHash: challenge, verifier };
};
