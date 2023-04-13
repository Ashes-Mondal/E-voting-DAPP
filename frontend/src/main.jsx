import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { EthereumProvider } from '../context/Ethereum'
import { AuthProvider } from '../context/Auth'
import {  BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EthereumProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </EthereumProvider>
  </React.StrictMode>,
)
