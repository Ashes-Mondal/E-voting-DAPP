import { useContext } from "react";
import { EthereumContext } from '../../context/Ethereum'
import { AuthContext } from "../../context/Auth";
import Plus from "../components/Plus";

export default function Main() {

	return (
		<>
			<Plus />
		</>
	);
}