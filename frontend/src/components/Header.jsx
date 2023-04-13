import { useContext } from "react";
import { EthereumContext } from "../../context/Ethereum";
import { AuthContext } from "../../context/Auth";
import vp from '../assets/images/vp.png'
import copy from '../assets/images/copy.png'

const Header = () => {
	const { connectWallet, currentAccount } = useContext(EthereumContext);
	const { handleLogout } = useContext(AuthContext);

	return (
		<div className="p-2 flex justify-between shadow-lg">
			<div className="flex flex-wrap items-center gap-2">
				<a href="/main">
					<img className="cursor-pointer" src={vp} alt="" width={47} height={40} />
				</a>
				<span className="font-bold text-red-600 text-xl">I vote</span>
			</div>
			<div className="flex gap-2">
				{!currentAccount &&
					(
						<div className="flex justify-center items-center ">
							<button onClick={connectWallet} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mx-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								Connect to Wallet
							</button>
						</div>
					)
				}
				{currentAccount && <div className="flex justify-center items-center">
					<span title={currentAccount} className="font-bold mx-2 mt-2">{currentAccount.substring(0, 10) + "..."}</span>
					<img onClick={() => { navigator.clipboard.writeText(currentAccount) }} src={copy} width={30} height={30} className="m-auto cursor-pointer hover:shadow-md" />
				</div>}
				<button className="text-white bg-red-700 hover:bg-red-500" onClick={handleLogout}>
					Logout
				</button>
			</div>
		</div>
	)

};
export default Header;
//text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mx-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800