import * as eccryptoJS from 'eccrypto-js';
import { bufferToHex, hexToBuffer } from 'eccrypto-js';

const stringifyEncryptedObject = (encrypted)=>{
	encrypted.ciphertext = encrypted.ciphertext.toString('hex')
	encrypted.mac = encrypted.mac.toString('hex')
	encrypted.iv = encrypted.iv.toString('hex')
	encrypted.ephemPublicKey = encrypted.ephemPublicKey.toString('hex')
	return JSON.stringify(encrypted);
}

const convertBackToEncryptedObject = (stringified)=>{
	stringified = JSON.parse(stringified);
	let encrypted = {}
	encrypted.ciphertext = hexToBuffer(stringified.ciphertext)
	encrypted.mac = hexToBuffer(stringified.mac)
	encrypted.iv = hexToBuffer(stringified.iv)
	encrypted.ephemPublicKey = hexToBuffer(stringified.ephemPublicKey)
	return encrypted;
}	
export const verifyKeyPair = (privateKeyHex,publicKeyHex)=>{
	const publicKeyHex_derived = bufferToHex(eccryptoJS.getPublic(hexToBuffer(privateKeyHex)));
	return publicKeyHex_derived === publicKeyHex;
}

export const getPublicKeyFromPrivateKey = (privateKeyHex)=>{
	const publicKeyHex_derived = bufferToHex(eccryptoJS.getPublic(hexToBuffer(privateKeyHex)));
	return publicKeyHex_derived;
}

export const genECCkeyPair = () => {
	const keyPair = eccryptoJS.generateKeyPair();
	return {publicKeyHex:bufferToHex(keyPair.publicKey),privateKeyHex:bufferToHex(keyPair.privateKey)}
}

export const encryptVote = async (voteUTF8, publicKeyHEX) => {
	//Vote: utf8, publicKey:hex returns HEX
	const publicKeyBuffer = eccryptoJS.hexToBuffer(publicKeyHEX);
	const voteBuffer = eccryptoJS.utf8ToBuffer(voteUTF8.toLowerCase());

	const encrypted = await eccryptoJS.encrypt(publicKeyBuffer, voteBuffer);
	return stringifyEncryptedObject(encrypted);
}

export const decryptVote = async (encryptedVoteStringified, privateKeyHEX) => {
	const privateKeyBuffer = eccryptoJS.hexToBuffer(privateKeyHEX);
	const encryptedVoteObject= convertBackToEncryptedObject(encryptedVoteStringified)
	const decryptedBuffer = await eccryptoJS.decrypt(privateKeyBuffer, encryptedVoteObject);
	return decryptedBuffer.toString();
}

export const verifyVote = async(voteUTF8,publicKeyHEX,encVoteStr)=>{
	return encVoteStr === encryptVote(voteUTF8,publicKeyHEX);
}