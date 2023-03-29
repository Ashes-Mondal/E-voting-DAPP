const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const winston = require('winston');
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
	]
});
const { encryptEC } = require("../../../utils/encryption-decryption");
const { userModel, electionModel } = require("../../../database/schemas");
const { abi, bytecode } = require('../../../../smart_contract/artifacts/contracts/Ballot.sol/Ballot.json')
const ethers = require('ethers');
const bcrypt = require('bcrypt');


router.post('/createPoll', async (req, res) => {
	const { voterID, username, candidates, smartContractAddress } = req.body;
	const doc = await userModel.findOne({ voterID, username });
	const hostPublicKey = doc.publicKey;
	try {
		const poll = await electionModel.create({ hostPublicKey, hostVoterID: voterID, candidates, smartContractAddress });
		await userModel.updateOne({ voterID, publicKey: hostPublicKey, username }, { $push: { pollsCreated: { pollID: poll._id } } });
		await userModel.updateMany({}, { $push: { elections: { pollID: poll._id } } });
		res.status(200).json(poll);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		res.end();
	}
})

router.get('/giveUniqueID/:pollID', async (req, res) => {
	const { voterID, username } = req.body;
	const { pollID } = req.params;
	try {
		const doc = await userModel.findOne({ voterID, username, 'elections.pollID': pollID }, 'publicKey elections.$');
		if (!doc) {
			res.sendStatus(404);
			return
		}
		const pollDoc = await electionModel.findById(pollID);
		let UUID = doc.elections[0].encryptedUID;
		if (UUID.length === 0) {
			//generate UUID
			UUID = crypto.randomUUID();
			// console.log(username,"\t",pollID,"\tUUID:", UUID)
			const hashedUID = await bcrypt.hash(UUID, 10);
			//encrypt UUID with publicKey of client
			UUID = await encryptEC(doc.publicKey, UUID,);
			await userModel.updateOne({ voterID, username, 'elections.pollID': pollID }, { 'elections.$.encryptedUID': UUID, 'elections.$.hashedUID': hashedUID });
		}
		res.json({ data: UUID, error: null });
	} catch (error) {
		console.error(error)
		res.sendStatus(500);
		res.end();
	}
})

router.post('/castVote', async (req, res) => {
	const { voterID, username, pollID, encryptedVote, UUID } = req.body;
	const doc = await electionModel.findOne({ _id: pollID });
	if (!doc) {
		res.status(404).send("No such election exsits!")
		return
	}
	try {
		const usr = await userModel.findOne({ voterID, username, 'elections.pollID': pollID }, 'elections.$');
		if (!usr) {
			res.status(403).send("User not participating in the poll process!")
			return;
		} else if (await bcrypt.compare(UUID, usr.elections[0].hashedUID) == false) {
			res.status(403).send("UUID mismatched!")
			return;
		}
		const contractAddress = doc.smartContractAddress;

		let provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
		const signer = new ethers.Wallet(process.env.PRIVATE_KEY_HH, provider);
		const BallotContract = new ethers.Contract(contractAddress, abi, signer)

		if (await BallotContract.checkVoteStatus(UUID)) {
			res.status(200).json({ data: "Already voted", error: null })
			return;
		}
		await BallotContract.addVote(UUID, encryptedVote);
		await userModel.updateOne({ voterID, username, 'elections.pollID': pollID }, { "elections.$.encryptedVote": encryptedVote });
		res.status(200).json({ data: "SUCCESS", error: null });
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
		res.end();
	}
})

module.exports = router;