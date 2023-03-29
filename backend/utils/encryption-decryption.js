var eccrypto = require("eccrypto");

const stringifyEncryptedObject = (encrypted) => {
	encrypted.ciphertext = encrypted.ciphertext.toString('hex')
	encrypted.mac = encrypted.mac.toString('hex')
	encrypted.iv = encrypted.iv.toString('hex')
	encrypted.ephemPublicKey = encrypted.ephemPublicKey.toString('hex')
	return JSON.stringify(encrypted);
}

const convertBackToEncryptedObject = (stringified) => {
	stringified = JSON.parse(stringified);
	let encrypted = {}
	encrypted.ciphertext = Buffer.from(stringified.ciphertext, "hex")
	encrypted.mac = Buffer.from(stringified.mac, "hex")
	encrypted.iv = Buffer.from(stringified.iv, "hex")
	encrypted.ephemPublicKey = Buffer.from(stringified.ephemPublicKey, "hex")
	return encrypted;
}

module.exports.encryptEC = async (publicKeyHex, strData) => {
	const encrypted = await eccrypto.encrypt(Buffer.from(publicKeyHex, "hex"), Buffer.from(strData));
	return stringifyEncryptedObject(encrypted);
}

module.exports.decryptEC = async (privateKeyHex, encryptedStringified) => {
	const decrypted = await eccrypto.decrypt(Buffer.from(privateKeyHex, "hex"), convertBackToEncryptedObject(encryptedStringified));
	return decrypted.toString();
}

