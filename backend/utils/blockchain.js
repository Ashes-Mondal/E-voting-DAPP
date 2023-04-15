const ethers = require('ethers');
const {abi,bytecode} = require('../../smart_contract/artifacts/contracts/Ballot.sol/Ballot.json')

module.exports.deployNewBallot = async(ownerAccountAddr) => {
	let provider = ethers.getDefaultProvider(process.env.JSON_RPC_PROVIDER);
	let privateKey = process.env.PRIVATE_KEY_HH
	let wallet = new ethers.Wallet(privateKey, provider);
	// Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, wallet);
    let contract = await factory.deploy(ownerAccountAddr);
	// await contract.deployed()
	return await contract.getAddress()
} 