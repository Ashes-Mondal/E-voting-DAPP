import { useContext, useState } from "react";
import { EthereumContext } from "../../context/Ethereum";
import { AuthContext } from "../../context/Auth";
import del from '../assets/images/delete.png'

export default function CreatePoll() {
	const { createNewPollOnBlockchain,currentAccount } = useContext(EthereumContext)
	const { user } = useContext(AuthContext)

	const [candidateName, setCandidateName] = useState("");
	const [candidates, setCandidates] = useState([]);
	const handleOnSubmit = () => {
		if(currentAccount && candidates.length)
			createNewPollOnBlockchain(candidates).then(_=>setCandidates([]))
		else if(candidates.length == 0){
			alert("Fill some candidates")
		}
		else{
			alert("Please connect wallet to continue further...")
		}
	}
	return (
		<>
			<form className="p-4" onSubmit={async (e) => {
				e.preventDefault()
				if (candidates.includes(candidateName.toLowerCase())) {
					setCandidateName("")
					return
				}
				setCandidates([candidateName.toLowerCase(), ...candidates]);
				setCandidateName("")
			}}>
				<div>
					<label className="block font-bold text-gray-700">Insert candidate</label>
					<input onChange={(e) => setCandidateName(e.target.value, ...candidates)} type="text" name="candidatename" id="candidatename" placeholder="Enter candidate name" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required value={candidateName} />
				</div>
				<div className="flex justify-around items-center">
					<button type="submit" className="w-32 block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">Insert</button>
					<button type="button" disabled={candidates.length<2} onClick={handleOnSubmit} className="w-32 block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">Submit</button>
				</div>
			</form>
			<div>
				{candidates.map((candidate, idx) => {
					return <div key={idx} className="flex gap-2 mx-4">
						<div><img className="cursor-pointer" src={del} width={20} height={20} onClick={() => {
							setCandidates(candidates.filter(cand => cand.toLowerCase() !== candidate.toLowerCase()))
						}} /></div>
						<span className="text-indigo-700 font-bold" >{candidate}</span>
					</div>
				})}
			</div>
		</>
	);
}