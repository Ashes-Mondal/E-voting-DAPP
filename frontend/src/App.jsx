import { useContext } from 'react'
import './App.css'
import { decryptVote, encryptVote, verifyKeyPair } from '../cryptography/ECC'
import Login from './pages/Login'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Protected from '../context/ProtectedRoute';
import { AuthContext } from '../context/Auth';
import Main from './pages/Main';
import CreatePoll from './pages/CreatePoll';

const justAFunc = async (privateKeyHex, publicKeyHex) => {
  const enc = await encryptVote("BJP", publicKeyHex);
  const dec = await decryptVote(enc, privateKeyHex);
  console.log("enc", JSON.stringify(enc), { "publicKeyHex": publicKeyHex, "privateKeyHex": privateKeyHex })
}

const onFileChange = async (e) => {
  const publicKeyHex = "04b638dd83eb8994c4733109be10ab1009543572da36c1db0e0c9e865a0fa8289a4188ee93f9baef65628c4bf19d68e4a90ccff6f8ad715b201c5d72250bce94e0"
  const newFile = e.target.files[0];
  const privatKeyHex = await newFile.text();
  console.log(verifyKeyPair(privatKeyHex, publicKeyHex))
}

function App() {
  const { user,userDataLoading } = useContext(AuthContext);

  return (
    <Routes>
      <Route exact path='/' element={
        <Login />
      } />
      <Route exact path='/main' element={
        <Protected user={user} userDataLoading={userDataLoading}>
          <Main />
        </Protected>
      } />
      <Route exact path='/create-poll' element={
        <Protected user={user} userDataLoading={userDataLoading}>
          <CreatePoll />
        </Protected>
      } />
    </Routes>

  )
}

export default App
