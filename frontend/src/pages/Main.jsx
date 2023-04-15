import { useContext, useEffect, useState } from "react";
import { EthereumContext } from '../../context/Ethereum'
import { AuthContext } from "../../context/Auth";
import Plus from "../components/Plus";
import vn from '../assets/images/vn.png'
import Election from "../components/Election";

export default function Main() {
	const {user} = useContext(AuthContext);
	const [elections, setElections] = useState([]);

	useEffect(()=>{
		if(user)
			setElections(user.elections);
	},[user])

	return (
		<>
			<Plus />
			<div className="flex justify-center">

			</div>
			{
				elections.length==0 ?
					<div className="flex justify-center items-center m-auto flex-col">
						<h1 className="text-orange-600 m-4">Noting to vote here!</h1>
						<img src={vn} />
					</div> : null
			}
			{
				elections.map((election,idx)=>{
					return <Election key={idx} election={election} idx={idx} />
				})
			}
		</>
	);
}