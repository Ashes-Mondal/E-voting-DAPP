const { getBallotContract, deployBallot } = require("../smart_contract/integration/Ballot");

const checkVoteStatus = async (addr, UUID) => {
	const contract = await getBallotContract(addr);
	return await contract.checkVoteStatus(UUID);
}

const addVote = async (addr, UUID, encryptedVote) => {
	const contract = await getBallotContract(addr);
	await contract.addVote(UUID, encryptedVote);
}

const getAllEncryptedVotes = async (ownerAddr, addr) => {
	const contract = await getBallotContract(addr);
	return await contract.getAllEncryptedVotes(ownerAddr);
}

module.exports = {
	checkVoteStatus,
	addVote,
	getAllEncryptedVotes,
	deployBallot
}