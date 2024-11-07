import { createHash } from "crypto";
import base64UrlEncode from "./base64UrlEncode";
import generateCodeVerifier from "./generateCodeVerifier";

export = (): { base64: string; verifier: string } => {
	const verifier = generateCodeVerifier();
	const hash = createHash("sha256");
	hash.update(verifier);
	const codeVerifierHash = hash.digest();
	const challenge = base64UrlEncode(codeVerifierHash);

	return { base64: challenge, verifier };
};
