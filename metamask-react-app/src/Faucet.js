import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MockERC20_ABI, MockERC20_Address_XYZ, MockERC20_Address_USDC } from './smartContracts'; // Import contract ABI and address

const Faucet = ({ account }) => {
  const [provider, setProvider] = useState(null);
  const [contract1, setContract1] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [decimals1, setDecimals1] = useState('');
  const [decimals2, setDecimals2] = useState('');
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
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

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
          const decimals1 = await contract1.decimals();
          setDecimals1(decimals1);
          const decimals2 = await contract2.decimals();
          setDecimals2(decimals2);
        }
      } catch (error) {
        console.error('Error fetching token symbols:', error);
      }
    };
    fetchTokenSymbols();
  }, [contract1, contract2]);

  const mintTokens1 = async () => {
    try {
      if (!contract1 || !amount1 || !decimals1) return;
      setLoading1(true);
      const parsedAmount = ethers.parseUnits(amount1, decimals1);
      const tx = await contract1.mint(account, parsedAmount);
      const transactionHash = tx.hash;
      setTransactionHash1(transactionHash);
      let receipt = null;
      while (!receipt) {
        receipt = await provider.getTransactionReceipt(transactionHash);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      setTransactionHashFinal1(transactionHash);
      setLoading1(false);
    } catch (error) {
      console.error('Error minting tokens 1:', error);
      setError1(error.message);
      setLoading1(false);
    }
  };

  const mintTokens2 = async () => {
    try {
      if (!contract2 || !amount2 || !decimals2) return;
      setLoading2(true);
      const parsedAmount = ethers.parseUnits(amount2, decimals2);
      const tx = await contract2.mint(account, parsedAmount);
      const transactionHash = tx.hash;
      setTransactionHash2(transactionHash);
      let receipt = null;
      while (!receipt) {
        receipt = await provider.getTransactionReceipt(transactionHash);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      setTransactionHashFinal2(transactionHash);
      setLoading2(false);
    } catch (error) {
      console.error('Error minting tokens 2:', error);
      setError2(error.message);
      setLoading2(false);
    }
  };

  return (
    <div className="container mt-5">
      {account ? (
        <>
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
            <button className="btn btn-primary" onClick={mintTokens1} disabled={loading1}>
              {loading1 ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Mint Tokens'
              )}
            </button>
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
            <button className="btn btn-primary" onClick={mintTokens2} disabled={loading2}>
              {loading2 ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Mint Tokens'
              )}
            </button>
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
      </>
    ) : (
      <div className="alert alert-warning" role="alert">
        Please connect your wallet.
      </div>
      )}
    </div>
  );
};

export default Faucet;
