import React, { useEffect, useState } from "react";
import { genECCkeyPair } from "../cryptography/ECC";
import { createAccount, logIntoAccount, logOutOfAccount } from "../axios/auth";
import { savePrivateKey } from "../cryptography/file";
import { getUserDetails } from "../axios/user";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userDataLoading,setUserDataLoading] = useState(true);

	//!Signup
	const handleSignup = async (username, pwd, voterID) => {
		try {
			const { publicKeyHex, privateKeyHex } = await genECCkeyPair();
			const resp = await createAccount({ username, pwd, voterID, publicKey: publicKeyHex })
			if (resp.data === "Success") {
				await savePrivateKey(privateKeyHex, voterID, username);
			}
		} catch (error) {
			console.error(error)
			throw error;
		}
	}

	//!Login
	const handleLogin = async (pwd, voterID) => {
		try {
			const user = await logIntoAccount({ pwd, voterID })
			if (user && !user.error) {
				setUserDataLoading(false)
				setUser(user.data)
			}
		} catch (error) {
			console.error(error)
			throw error;
		}
	}

	//!Logout
	const handleLogout = async ()=>{
		try {
			await logOutOfAccount();
			setUser(null);
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		getUserDetails().then(resp => {
			setUserDataLoading(false)
			setUser(resp.data)
		}).catch(err=>console.warn(err))
	}, [])

	return (
		<AuthContext.Provider
			value={{
				handleSignup,
				handleLogin,
				handleLogout,
				user,
				userDataLoading
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}