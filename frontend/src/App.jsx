import { useEffect, useState, useContext } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { savePrivateKey } from '../cryptography/file'
import { decryptVote, encryptVote, genECCkeyPair, verifyKeyPair } from '../cryptography/ECC'
import { EthereumContext } from "../context/Ethereum";

const justAFunc = async (privateKeyHex, publicKeyHex) => {
  const enc = await encryptVote("BJP", publicKeyHex);
  const dec = await decryptVote(enc, privateKeyHex);
  console.log("enc",JSON.stringify(enc),{"publicKeyHex":publicKeyHex,"privateKeyHex":privateKeyHex})
}

function App() {
  const [count, setCount] = useState(0)

  const onFileChange = async (e) => {
    const publicKeyHex = "04b638dd83eb8994c4733109be10ab1009543572da36c1db0e0c9e865a0fa8289a4188ee93f9baef65628c4bf19d68e4a90ccff6f8ad715b201c5d72250bce94e0"
    const newFile = e.target.files[0];
    const privatKeyHex = await newFile.text();
    console.log(verifyKeyPair(privatKeyHex, publicKeyHex))
  }


  useEffect(() => {
    const { privateKeyHex, publicKeyHex } = genECCkeyPair()
    
    justAFunc(privateKeyHex,publicKeyHex).then()
    // savePrivateKey(privateKeyHex)
  }, [])

  return (
    <div className="App">

      <div className="p-4">
        <label className="block text-gray-700 text-sm font-bold" htmlFor="address">
          Private Key:
        </label>
        <input accept=".pem" onChange={onFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 border-black" id="Private_file" type="file" placeholder="file" />
      </div>

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
