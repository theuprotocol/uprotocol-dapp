import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UP_TOKEN_ADDR, UP_TOKEN_ABI, MockERC20_ABI } from './smartContracts'; // Import contract ABI and address

const TokenizePage = ({ account }) => {
  const [, setProvider] = useState(null);
  const [upTokenContract, setUpTokenContract] = useState(null);
  const [underlyingTokenContract, setUnderlyingTokenContract] = useState(null);
  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(null);
  const [upTokenSymbol, setUpTokenSymbol] = useState(null);
  const [upTokenStrike, setUpTokenStrike] = useState(null);
  const [upTokenExpiry, setUpTokenExpiry] = useState(null);
  const [settlementTokenAddress, setSettlementTokenAddress] = useState(null);
  const [settlementTokenDecimals, setSettlementTokenDecimals] = useState(null);
  const [settlementTokenSymbol, setSettlementTokenSymbol] = useState(null);
  const [underlyingSymbol, setUnderlyingSymbol] = useState(null);
  const [underlyingAmount, setUnderlyingAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (account) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          const upTokenContract = new ethers.Contract(UP_TOKEN_ADDR, UP_TOKEN_ABI, signer);
          console.log(UP_TOKEN_ADDR)
          setUpTokenContract(upTokenContract);
          setUpTokenSymbol(await upTokenContract.symbol());
          setUpTokenStrike(await upTokenContract.strike());
          console.log("strike", await upTokenContract.strike())
          setUpTokenExpiry(await upTokenContract.expiry());
          const underlyingTokenAddress = await upTokenContract.underlyingToken();
          const underlyingTokenContract = new ethers.Contract(underlyingTokenAddress, MockERC20_ABI, signer);
          setUnderlyingTokenAddress(underlyingTokenAddress)
          setUnderlyingTokenContract(underlyingTokenContract);
          setUnderlyingSymbol(await underlyingTokenContract.symbol());

          const settlementTokenAddress = await upTokenContract.settlementToken()
          setSettlementTokenAddress(settlementTokenAddress)
          const settlementTokenContract = new ethers.Contract(settlementTokenAddress, MockERC20_ABI, signer);
          setSettlementTokenDecimals(await settlementTokenContract.decimals());
          setSettlementTokenSymbol(await settlementTokenContract.symbol());
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    connectToMetaMask();
  }, [account]);

  const tokenize = async () => {
    try {
      console.log(upTokenContract)
      if (!upTokenContract || !underlyingTokenContract || !underlyingAmount) return;
      setLoading(true);
      const parsedAmount = ethers.parseUnits(underlyingAmount, await underlyingTokenContract.decimals());
      const tx = await upTokenContract.tokenize(account, parsedAmount);
      await tx.wait(); // Wait for the transaction to be mined
      setLoading(false);
    } catch (error) {
      console.error('Error tokenizing:', error);
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="container mt-5">
      {account && underlyingTokenAddress && upTokenExpiry && upTokenStrike && settlementTokenDecimals ? (
        <>
          <h1 className="mb-4">Tokenize 
            <a href={`https://sepolia.scrollscan.com/address/${underlyingTokenAddress}`} className="ms-2" target="_blank" rel="noopener noreferrer">{underlyingSymbol}</a> 
             into 
            <a href={`https://sepolia.scrollscan.com/address/${UP_TOKEN_ADDR}`} className="ms-2" target="_blank" rel="noopener noreferrer">{upTokenSymbol}</a>
          </h1>
          <div className="mb-3">
            Expiry: {new Date(Number(upTokenExpiry) * 1000).toLocaleDateString()} 
            <br />
            Strike: {(ethers.toBigInt(upTokenStrike) / (ethers.toBigInt(10) ** ethers.toBigInt(settlementTokenDecimals))).toString()} {settlementTokenSymbol} 
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Underlying Amount to Tokenize"
                value={underlyingAmount}
                onChange={(e) => setUnderlyingAmount(e.target.value)}
              />
              <button className="btn btn-primary" onClick={tokenize} disabled={loading}>
                {loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Tokenize'
                )}
              </button>
            </div>
            {error && (
              <div className="alert alert-danger">
                Error: {error}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="alert alert-warning" role="alert">
          Please connect your wallet to tokenize assets.
        </div>
      )}
    </div>
  );
};

export default TokenizePage;
