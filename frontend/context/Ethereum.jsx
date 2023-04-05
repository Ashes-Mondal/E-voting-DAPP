import { abi, bytecode } from '../../smart_contract/artifacts/contracts/Ballot.sol/Ballot.json'
import { ethers, ContractFactory } from "ethers";
import React, { useEffect, useState } from "react";
import { useCallback } from 'react';
import { verifyVote } from '../cryptography/ECC';

export const EthereumContext = React.createContext();
const { ethereum } = window;

const deployBallotContract = async () => {
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner();
	const factory = new ContractFactory(abi, bytecode, signer);
	// If your contract requires constructor args, you can specify them here
	const contract = await factory.deploy();
	return contract;
}
const getBallotContract = (addr) => {
	// const provider = new ethers.providers.JsonRpcProvider(URL);
	const provider = new ethers.providers.Web3Provider(ethereum)
	const signer = provider.getSigner();
	const contract = new ethers.Contract(addr, abi, signer)
	return contract;
}

export const EthereumProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState("");

	const checkIfWalletIsConnect = useCallback(async () => {
		try {
			if (!ethereum) return alert("Please install MetaMask.");
			const accounts = await ethereum.request({ method: "eth_accounts" });
			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log("No accounts found");
			}
		} catch (error) {
			console.error(error);
		}
	}, [])

	//! CONNECT TO METAMASK WALLET
	const connectWallet = useCallback(async () => {
		try {
			if (!ethereum) return alert("Please install MetaMask.");
			const accounts = await ethereum.request({ method: "eth_requestAccounts", });
			setCurrentAccount(accounts[0]);
			window.location.reload();
		} catch (error) {
			console.log(error);
			throw new Error("No ethereum object");
		}
	}, [])

	//! Deploy ballot to blockchain
	const deployBallot = useCallback(async () => {
		const contract = await deployBallotContract();
		return await contract.getAddress()
	}, [])


	//! Close Voting Phase
	const closeVotingPhase = useCallback(async (addr) => {
		const contract = await getBallotContract(addr);
		await contract.closeVotingPhase()
	}, [])


	//! GET MY VOTES
	const getVoteFromBlockChain = useCallback(async (addr, UUID, candidates, publicKeyHex) => {
		try {
			const contract = await getBallotContract(addr);
			const encVote = await contract.getEncryptedVote(UUID);
			let retObj = {};
			for (let i = 0; i < candidates.length(); i++) {
				if (await verifyVote(candidates[i], publicKeyHex, encVote)) {
					retObj[candidates[i]] = true;
				} else {
					retObj[candidates[i]] = false;
				}
			}
			return retObj;
		} catch (error) {
			console.error(error);
		}
	}, [])


	useEffect(() => {
		checkIfWalletIsConnect().then()
	}, []);

	return (
		<EthereumContext.Provider
			value={{
				connectWallet,
				currentAccount,
				deployBallot,
				closeVotingPhase,
				getVoteFromBlockChain
			}}
		>
			{children}
		</EthereumContext.Provider>
	);
};