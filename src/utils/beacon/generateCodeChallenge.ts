export = function generateCodeChallenge(): Promise<{
	codeVerifier: string;
	codeChallenge: string;
}> {
	// Step 1: Generate a random code_verifier of 32 ASCII-friendly characters
	const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
		.map((byte) => String.fromCharCode(33 + (byte % 94))) // ASCII-friendly range from '!' to '~'
		.join("");

	// Step 2: Hash the code_verifier using SHA-256 and encode it in base64 URL format
	const encodeBase64Url = (arrayBuffer: ArrayBuffer) =>
		btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, ""); // Base64 URL encoding

	return crypto.subtle
		.digest("SHA-256", new TextEncoder().encode(codeVerifier))
		.then((hashBuffer) => {
			const codeChallenge = encodeBase64Url(hashBuffer);
			return { codeVerifier, codeChallenge };
		});
};
