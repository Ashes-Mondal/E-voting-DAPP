const { abi,bytecode }  = require('../artifacts/contracts/Ballot.sol/Ballot.json') 
const {ethers,ContractFactory} = require('ethers')

const getBallotContract = (addr) => {
	// const provider = new ethers.providers.Web3Provider(ethereum)
	const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(addr, abi, signer)
	return contract;
}

const deployBallot = async (ownerAddr) => {
	// const provider = new ethers.providers.Web3Provider(ethereum)
	const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
	const signer = provider.getSigner();
	const factory = new ContractFactory(abi, bytecode, signer);
	// If your contract requires constructor args, you can specify them here
	const contract = await factory.deploy(ownerAddr);
	return contract;
}

module.exports = {
	getBallotContract,
	deployBallot
}