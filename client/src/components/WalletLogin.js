import React, { useState } from 'react';
import { BrowserProvider } from 'ethers'; 

const WalletLogin = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Use BrowserProvider in ethers.js v6.x
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);  // Request account access
        const signer = await provider.getSigner();  // Get the signer for transactions
        const address = await signer.getAddress();  // Get the user's wallet address
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl">Connect Your Wallet</h2>
      <button 
        onClick={connectWallet} 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}
    </div>
  );
};

export default WalletLogin;
