import { useContext, useEffect } from "react";
import { EthereumContext } from "../../context/Ethereum";
import gtic from '../assets/images/gtic.png'
import vote from '../assets/images/vote.png'
import { useState } from "react";
import { castMyVote } from "../../axios/election";
import rk from '../assets/images/redKey.png'
import gk from '../assets/images/greenKey.png'
import v from '../assets/images/v.png'
import { decryptVote, getPublicKeyFromPrivateKey, verifyKeyPair } from "../../cryptography/ECC";
import { AuthContext } from "../../context/Auth";
import { saveFile } from "../../cryptography/file";
import sha256 from 'js-sha256'


export default function Election({ election, idx }) {
	const { closeVotingPhase, currentAccount, getEncVoteFromBlockChain, getAllEncVoteFromBlockChain } = useContext(EthereumContext);
	const { user } = useContext(AuthContext);
	const pollId = election.pollID._id
	const smartContractAddress = election.pollID.smartContractAddress
	const candidates = election.pollID.candidates
	const [voteStatus, setVoteStatus] = useState({})
	const [privateKey, setPrivateKey] = useState(null)
	const [voteVerify, setvoteVerify] = useState(false)

	const handleVote = async (candidate) => {
		if (!privateKey) {
			alert("Please provide private key!")
			return;
		}
		if (confirm(`Are you sure want to vote to ${candidate}!`)) {
			try {
				const encVote = await castMyVote(candidate, pollId, election.pollID.hostPublicKey, privateKey, getPublicKeyFromPrivateKey(privateKey))
				if (encVote.error) {
					alert(encVote.error)
					return;
				}
				alert(`Success, vote given to: ${candidate}`)
				const hashedEncVote = sha256(encVote);
				saveFile(hashedEncVote, `${pollId}_${user.username}.txt`)
				alert("Use this .txt file to verify your vote later!")
				window.location.reload();
			} catch (error) {
				console.warn(error)
			}
		}
	}

	const verifyVote = async (e) => {
		if (privateKey) {
			const newFile = e.target.files[0];
			const Votehash = await newFile.text();
			const encVote = await getEncVoteFromBlockChain(smartContractAddress, election.encryptedUID, privateKey)
			const hashedEncVote = sha256(encVote);
			if (Votehash == hashedEncVote) {
				alert("Verified vote!")
				setvoteVerify(true)
			}
		} else {
			alert("Please provide private key!")
			return;
		}
	}

	const onFileChange_privateKey = async (e) => {
		try {
			const newFile = e.target.files[0];
			const privatK = await newFile.text();
			const ans = await verifyKeyPair(privatK, user.publicKey);
			if (ans) {
				setPrivateKey(privatK);
			}
			else {
				alert("Invalid private key.")
			}
		} catch (error) {
			console.error(error)
		}
	}

	const closeVotingSession = async () => {
		try {
			if (currentAccount)
				await closeVotingPhase(election.pollID.smartContractAddress)
			else {
				alert("Please connect wallet to continue further.")
			}
		} catch (error) {
			console.error(error);
		}
	}

	const verifyIfCreatedByUser = () => {
		let ans = false;
		for (let i = 0; i < user.pollsCreated.length; i++) {
			if (user.pollsCreated[i].pollID == pollId) {
				ans = true;
				break;
			}
		}
		return ans;
	}

	const knowResultHandler = async () => {
		if (!privateKey) {
			alert("Please provide private key!")
			return;
		}
		getAllEncVoteFromBlockChain(smartContractAddress).then(async (resp) => {
			let ans = {};
			candidates.forEach((cand)=>{
				ans[cand] = 0;
			})
			for (let i = 0; i < resp.length; i++) {
				const cand = await decryptVote(resp[i], privateKey);
				ans[cand]++;
			}
			confirm(JSON.stringify(ans));
		}).catch(err => console.warn(err))
	}

	useEffect(() => {
		if (election.encryptedVote.length > 0 && privateKey) {
			let obj = {}
			for (let i = 0; i < candidates.length; i++) {
				obj[candidates[i]] = false;
			}
			decryptVote(election.encryptedVote, privateKey).then(resp => {
				obj[resp] = true
				setVoteStatus(obj)
			});
		}
	}, [privateKey])

	return (
		<div className={`border p-8 ${idx & 1 ? "" : "bg-sky-200"}`}>
			<div className="flex gap-2">
				<span className="text-red-700 font-bold">ID:</span>
				<span className="font-bold">{pollId}</span>
			</div>

			<div className="flex gap-2">
				<span className="text-red-700 font-bold">OrganizerID:</span>
				<span className="font-bold">{election.pollID.hostVoterID}</span>
			</div>
			<div className="flex gap-2 mt-4">
				<span className="text-red-700 font-bold">Participants:</span>

			</div>
			{
				candidates.map((candidate, i) => {
					return <div key={i} className="flex gap-2 items-center">
						{!election.encryptedVote.length && !voteStatus[candidate] ? <img onClick={async () => await handleVote(candidate)} src={vote} width={40} height={40} className="rounded-full cursor-pointer hover:bg-green-300" /> : null}
						<span className="font-bold">{candidate}</span>
						{election.encryptedVote.length && voteStatus[candidate] ? <img src={gtic} width={40} height={40} /> : null}
					</div>
				})
			}
			<div className="p-4">
				<div className="flex gap-2 items-center">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Private_file">
						Private Key {privateKey ? "found" : "not found"}:
						{privateKey ? <img src={gk} width={40} height={40} /> : <img src={rk} width={40} height={40} />}
					</label>
					{voteVerify ?
						<label label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Private_file">
							<img src={v} width={60} height={60} />
						</label> : null
					}
				</div>

				<input accept=".pem" onChange={onFileChange_privateKey} className={`shadow appearance-none border rounded w-full py-2 px-3 border-black ${privateKey ? "hidden" : ""}`} id="Private_file" type="file" placeholder="file" />
				{privateKey && election.encryptedVote.length && !voteVerify ? <label label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Private_file">
					Verify vote:
				</label> : null}
				{election.encryptedVote.length && !voteVerify ? <input accept=".txt" onChange={verifyVote} className={`shadow appearance-none border rounded w-full py-2 px-3 border-black ${privateKey ? "" : "hidden"}`} id="hash_file" type="file" placeholder="file" /> : null}
			</div>
			{
				verifyIfCreatedByUser() ?
					<div className="flex justify-center items-center">
						<button onClick={closeVotingSession} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mx-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
							Close voting
						</button>
						<button onClick={knowResultHandler} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mx-2 dark:bg-green-600 dark:hover:bg-red-700 dark:focus:ring-green-800">
							Know result
						</button>
					</div>
					: null
			}
		</div >
	);
}