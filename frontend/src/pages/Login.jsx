import { useEffect, useState, useContext } from 'react'
import vp from '../assets/images/vp.png'
// import vd from '../assets/images/vd.jpg'
import vd from '../assets/images/result.png'
import { AuthContext } from '../../context/Auth'
import { Navigate } from "react-router-dom";

const LoginForm = ({ setIsLogin }) => {
	const { handleLogin } = useContext(AuthContext);
	const [voterID, setVoterID] = useState('');
	const [pwd, setPwd] = useState('');
	const [error, setError] = useState('');

	return (
		<>
			<h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>
			<form className="mt-6" onSubmit={(e) => {
				e.preventDefault()
				if (voterID.length < 1) {
					setError("Please enter voterID!")
					return
				} else if (!pwd) {
					setError("Please enter password!")
				}
				handleLogin(pwd,voterID).catch(err=>setError(err))
			}}>
				<input name="csrfToken" type="hidden" // defaultValue={csrfToken} 
				/>
				{
					error ? <label className="block text-red-700">{error}</label> : null
				}
				<div>
					<label className="block text-gray-700">VoterID</label>
					<input onChange={(e) => setVoterID(e.target.value)} type="text" name="VoterID" id="VoterID" placeholder="Enter VoterID" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>
				<div>
					<label className="block text-gray-700">Password</label>
					<input onChange={(e) => setPwd(e.target.value)} type="password" name="password" id="password" placeholder="Enter password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>
				<button type="submit" className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">Log In</button>
			</form>
			<div className="text-center my-4 font-bold">Not have an account? <span className='text-sky-800 cursor-pointer underline' onClick={() => setIsLogin(false)}> Signup</span></div>
		</>
	)
}

const SignupForm = ({ setIsLogin }) => {
	const { handleSignup } = useContext(AuthContext);
	const [voterID, setVoterID] = useState('');
	const [username, setUsername] = useState('');
	const [pwd, setPwd] = useState('');
	const [error, setError] = useState('');

	return (
		<>
			<h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Create new account</h1>
			<form className="mt-6" onSubmit={(e) => {
				e.preventDefault()
				if (voterID.length < 1) {
					setError("Please enter voterID!")
					return
				} else if (pwd.length < 1) {
					setError("Please enter password!")
				} else if (username.length < 1) {
					setError("Please enter username!")
				}
				handleSignup(username, pwd, voterID).catch(err=>setError(err))
			}}>
				<input name="csrfToken" type="hidden" // defaultValue={csrfToken} 
				/>
				{
					error ? <label className="block text-red-700">{error}</label> : null
				}
				<div>
					<label className="block text-gray-700">VoterID</label>
					<input onChange={(e) => setVoterID(e.target.value)} type="text" name="VoterID" id="VoterID" placeholder="Enter VoterID" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>
				<div>
					<label className="block text-gray-700">Username</label>
					<input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" placeholder="Enter username" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>
				<div>
					<label className="block text-gray-700">Password</label>
					<input onChange={(e) => setPwd(e.target.value)} type="password" name="password" id="password" placeholder="Enter password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>
				<button type="submit" className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">SignUp</button>
			</form>
			<div className="text-center my-4 font-bold">Already have an account? <span className='text-sky-800 cursor-pointer underline' onClick={() => setIsLogin(true)}> Login</span></div>
		</>
	)
}

export default function Login() {
	const { user } = useContext(AuthContext);
	if(user){
		return <Navigate to="/main" replace />;
	}
	const [isLogin, setIsLogin] = useState(true);
	return (
		<>
			<section className="flex flex-col md:flex-row h-screen items-center">
				<div className="bg-white-600 hidden md:block w-full md:w-1/2 xl:w-2/3 h-screen flex justify-center justify-items-center">
					<img
						src={isLogin ? vd : 'https://free4kwallpapers.com/uploads/originals/2021/03/12/low-poly-planet-wallpaper.jpg'}
						//  src='https://free4kwallpapers.com/uploads/originals/2021/03/12/low-poly-planet-wallpaper.jpg' 
						alt="" className={` w-full h-full  ${isLogin ? 'object-contain' : 'object-cover'}`} />
				</div>
				<div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
					<div className="w-full h-100">
						<div className="flex flex-wrap items-center">
							<a href="/main">
								<img className="cursor-pointer" src={vp} alt="" width={40} height={40} />
							</a>
						</div>
						<a href="/" ><h1 className="text-xl font-bold cursor-pointer">E-Voting :  <span className="font-bold text-red-600 text-xl">I vote</span></h1></a>
						{isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <SignupForm setIsLogin={setIsLogin} />}
					</div>
				</div>
			</section>
		</>
	);
}