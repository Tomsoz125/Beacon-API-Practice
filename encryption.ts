import { generateKeyPairSync } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as forge from "node-forge";

export function getCurrentKeys() {
	if (!isValidPemKey("public_key.pem") || !isValidPemKey("private_key.pem")) {
		storeNewKeys();
	}
	const publicKey = readFileSync("public_key.pem", "utf8");
	const privateKey = readFileSync("private_key.pem", "utf8");
	return { publicKey, privateKey };
}

export function decryptWithPrivateKey(encryptedMessageBase64: string) {
	const { privateKey: privateKeyPem } = getCurrentKeys();

	const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

	const encryptedMessage = forge.util.decode64(encryptedMessageBase64);

	try {
		const decryptedMessage = privateKey.decrypt(
			encryptedMessage,
			"RSA-OAEP"
		);
		const hexOutput = forge.util.bytesToHex(decryptedMessage);

		console.log("Decrypted message:", hexOutput);
	} catch (e) {
		console.log("Error during decryption:", e);
	}
}

export function storeNewKeys() {
	const { publicKey, privateKey } = generateKeys();

	writeFileSync("public_key.pem", publicKey);
	writeFileSync("private_key.pem", privateKey);
}

export function generateKeys() {
	return generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: "spki",
			format: "pem"
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem"
		}
	});
}

function base64ToHex(base64Key: string): string {
	const cleanBase64Key = base64Key
		.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, "")
		.replace(/\s+/g, "");

	const decodedBuffer = Buffer.from(cleanBase64Key, "base64");

	const hexString = decodedBuffer.toString("hex");

	return hexString;
}

function isValidPemKey(pemFilePath: string): boolean {
	try {
		if (!existsSync(pemFilePath)) {
			console.log(`${pemFilePath} does not exist.`);
			return false;
		}
		const pemContent = readFileSync(pemFilePath, "utf8");
		const isValid =
			pemContent.includes("-----BEGIN PUBLIC KEY-----") ||
			pemContent.includes("-----BEGIN PRIVATE KEY-----");

		return isValid;
	} catch (error) {
		console.error("Error reading PEM file:", error);
		return false;
	}
}

export function getCurrentKeysHex() {
	if (!isValidPemKey("public_key.pem") || !isValidPemKey("private_key.pem")) {
		storeNewKeys();
	}
	const publicKey = getHexKey("public_key.pem");
	const privateKey = getHexKey("private_key.pem");
	return { publicKey, privateKey };
}

export function getHexKey(pemFilePath: string): string {
	const keyPem = readFileSync(pemFilePath, "utf8");
	return base64ToHex(keyPem);
}
