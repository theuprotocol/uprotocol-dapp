import React, { useState } from 'react';
import { ethers } from 'ethers';
import { MockERC20_ABI, MockERC20_Address } from './smartContracts'; // Import contract ABI and address

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionHashFinal, setTransactionHashFinal] = useState('');

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setAccount(await signer.getAddress());
        const contract = new ethers.Contract(MockERC20_Address, MockERC20_ABI, signer);
        setContract(contract);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  const mintTokens = async () => {
    if (contract && amount) {
      try {
        const parsedAmount = ethers.parseEther(amount);
        const tx = await contract.mint(account, parsedAmount);
        const transactionHash = tx.hash;
        setTransactionHash(transactionHash);
        let receipt = null;
        while (!receipt) {
          receipt = await provider.getTransactionReceipt(transactionHash);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        setTransactionHashFinal(transactionHash);
      } catch (error) {
        console.error('Error minting tokens:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">React MetaMask Integration</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button className="btn btn-primary mb-3" onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Amount to mint"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={mintTokens}>Mint Tokens</button>
      </div>
      {transactionHash && !transactionHashFinal && (
        <div className="alert alert-info">
          Transaction submitted, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </div>
      )}
      {transactionHash && transactionHashFinal && (
        <div className="alert alert-success">
          Transaction success, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHashFinal}`} target="_blank" rel="noopener noreferrer">
            {transactionHashFinal}
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
