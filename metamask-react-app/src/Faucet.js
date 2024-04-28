import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MockERC20_ABI, MockERC20_Address_XYZ, MockERC20_Address_USDC } from './smartContracts'; // Import contract ABI and address

const Faucet = ({ account }) => {
  const [provider, setProvider] = useState(null);
  const [contract1, setContract1] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [transactionHash1, setTransactionHash1] = useState('');
  const [transactionHashFinal1, setTransactionHashFinal1] = useState('');
  const [transactionHash2, setTransactionHash2] = useState('');
  const [transactionHashFinal2, setTransactionHashFinal2] = useState('');
  const [tokenSymbol1, setTokenSymbol1] = useState('');
  const [tokenSymbol2, setTokenSymbol2] = useState('');
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    console.log(account)
    const connectToMetaMask = async () => {
      if (account) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          setProvider(provider);
          const contract1 = new ethers.Contract(MockERC20_Address_XYZ, MockERC20_ABI, signer);
          setContract1(contract1);
          const contract2 = new ethers.Contract(MockERC20_Address_USDC, MockERC20_ABI, signer);
          setContract2(contract2);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    connectToMetaMask();
  }, [account]);

  useEffect(() => {
    const fetchTokenSymbols = async () => {
      try {
        if (contract1 && contract2) {
          const symbol1 = await contract1.symbol();
          setTokenSymbol1(symbol1);
          const symbol2 = await contract2.symbol();
          setTokenSymbol2(symbol2);
        }
      } catch (error) {
        console.error('Error fetching token symbols:', error);
      }
    };
    fetchTokenSymbols();
  }, [contract1, contract2]);

  const mintTokens1 = async () => {
    try {
      if (!contract1 || !amount1) return;
      const parsedAmount = ethers.parseEther(amount1);
      const tx = await contract1.mint(account, parsedAmount);
      const transactionHash = tx.hash;
      setTransactionHash1(transactionHash);
      let receipt = null;
      while (!receipt) {
        receipt = await provider.getTransactionReceipt(transactionHash);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      setTransactionHashFinal1(transactionHash);
    } catch (error) {
      console.error('Error minting tokens 1:', error);
      setError1(error.message);
    }
  };

  const mintTokens2 = async () => {
    try {
      if (!contract2 || !amount2) return;
      const parsedAmount = ethers.parseEther(amount2);
      const tx = await contract2.mint(account, parsedAmount);
      const transactionHash = tx.hash;
      setTransactionHash2(transactionHash);
      let receipt = null;
      while (!receipt) {
        receipt = await provider.getTransactionReceipt(transactionHash);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      setTransactionHashFinal2(transactionHash);
    } catch (error) {
      console.error('Error minting tokens 2:', error);
      setError2(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Faucet</h1>
      <div className="mb-3">
        <h4>Mint 
          <a href={`https://sepolia.scrollscan.com/address/${MockERC20_Address_XYZ}`} className="ms-2" target="_blank" rel="noopener noreferrer">
            {tokenSymbol1}
          </a>
        </h4>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount to mint"
            value={amount1}
            onChange={(e) => setAmount1(e.target.value)}
          />
          <button className="btn btn-primary" onClick={mintTokens1}>Mint Tokens</button>
        </div>
        {transactionHash1 && !transactionHashFinal1 && (
          <div className="alert alert-info">
            Transaction submitted, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHash1}`} target="_blank" rel="noopener noreferrer">
              {transactionHash1}
            </a>
          </div>
        )}
        {transactionHash1 && transactionHashFinal1 && (
          <div className="alert alert-success">
            Transaction success, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHashFinal1}`} target="_blank" rel="noopener noreferrer">
              {transactionHashFinal1}
            </a>
          </div>
        )}
        {error1 && (
          <div className="alert alert-danger">
            Error: {error1}
          </div>
        )}
      </div>
      <div>
        <h4>Mint 
          <a href={`https://sepolia.scrollscan.com/address/${MockERC20_Address_USDC}`} className="ms-2" target="_blank" rel="noopener noreferrer">
            {tokenSymbol2}
          </a>
        </h4>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount to mint"
            value={amount2}
            onChange={(e) => setAmount2(e.target.value)}
          />
          <button className="btn btn-primary" onClick={mintTokens2}>Mint Tokens</button>
        </div>
        {transactionHash2 && !transactionHashFinal2 && (
          <div className="alert alert-info">
            Transaction submitted, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHash2}`} target="_blank" rel="noopener noreferrer">
              {transactionHash2}
            </a>
          </div>
        )}
        {transactionHash2 && transactionHashFinal2 && (
          <div className="alert alert-success">
            Transaction success, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHashFinal2}`} target="_blank" rel="noopener noreferrer">
              {transactionHashFinal2}
            </a>
          </div>
        )}
        {error2 && (
          <div className="alert alert-danger">
            Error: {error2}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faucet;
