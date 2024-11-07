import { randomBytes } from "crypto";

export = () => {
	const allowedChars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

	const length = 64;

	// Generate random bytes
	const randomBytesBuffer = randomBytes(length);

	let codeVerifier = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = randomBytesBuffer[i] % allowedChars.length;
		codeVerifier += allowedChars[randomIndex];
	}

	return codeVerifier;
};
