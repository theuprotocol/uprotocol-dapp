import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UP_TOKEN_ADDR, UP_TOKEN_ABI, MockERC20_ABI, CAP_TOKEN_ADDR, CAP_TOKEN_ABI } from './smartContracts'; // Import contract ABI and address

const TokenizePage = ({ account }) => {
  const [, setProvider] = useState(null);
  const [upTokenContract, setUpTokenContract] = useState(null);
  const [underlyingTokenContract, setUnderlyingTokenContract] = useState(null);
  const [underlyingTokenAddress, setUnderlyingTokenAddress] = useState(null);
  const [upTokenSymbol, setUpTokenSymbol] = useState(null);
  const [, setCapTokenContract] = useState(null);
  const [capTokenSymbol, setCapTokenSymbol] = useState(null);
  const [upTokenStrike, setUpTokenStrike] = useState(null);
  const [upTokenExpiry, setUpTokenExpiry] = useState(null);
  const [, setSettlementTokenAddress] = useState(null);
  const [settlementTokenDecimals, setSettlementTokenDecimals] = useState(null);
  const [settlementTokenSymbol, setSettlementTokenSymbol] = useState(null);
  const [underlyingSymbol, setUnderlyingSymbol] = useState(null);
  const [underlyingAmount, setUnderlyingAmount] = useState(0);
  const [underlyingTokenDecimals, setUnderlyingTokenDecimals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowance, setAllowance] = useState(0);
  const [loadingData, setLoadingData] = useState(true); // New state variable to track loading data
  const [transactionHash, setTransactionHash] = useState(null); // State variable for transaction hash
  const [transactionVerified, setTransactionVerified] = useState(false); // State variable to indicate if transaction is verified
  const [underlyingTokenBal, setUnderlyingTokenBal] = useState(false);
  const [capTokenBal, setCapTokenBal] = useState(false);
  const [upTokenBal, setUpTokenBal] = useState(false);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (account) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          const upTokenContract = new ethers.Contract(UP_TOKEN_ADDR, UP_TOKEN_ABI, signer);
          setUpTokenContract(upTokenContract);
          setUpTokenSymbol(await upTokenContract.symbol());
          setUpTokenStrike(await upTokenContract.strike());
          setUpTokenExpiry(await upTokenContract.expiry());
          setUpTokenBal(await upTokenContract.balanceOf(account))

          const capTokenContract = new ethers.Contract(CAP_TOKEN_ADDR, CAP_TOKEN_ABI, signer);
          setCapTokenContract(capTokenContract);
          setCapTokenBal(await capTokenContract.balanceOf(account))

          setCapTokenSymbol(await capTokenContract.symbol());
          const underlyingTokenAddress = await upTokenContract.underlyingToken();
          const underlyingTokenContract = new ethers.Contract(underlyingTokenAddress, MockERC20_ABI, signer);
          setUnderlyingTokenBal(await underlyingTokenContract.balanceOf(account))
          setUnderlyingTokenAddress(underlyingTokenAddress)
          setUnderlyingTokenContract(underlyingTokenContract);
          setUnderlyingSymbol(await underlyingTokenContract.symbol());
          setUnderlyingTokenDecimals(await underlyingTokenContract.decimals());

          const settlementTokenAddress = await upTokenContract.settlementToken()
          setSettlementTokenAddress(settlementTokenAddress)
          const settlementTokenContract = new ethers.Contract(settlementTokenAddress, MockERC20_ABI, signer);
          setSettlementTokenDecimals(await settlementTokenContract.decimals());
          setSettlementTokenSymbol(await settlementTokenContract.symbol());

          // Get allowance for upToken to spend underlying tokens
          const userAllowance = await underlyingTokenContract.allowance(account, UP_TOKEN_ADDR);
          setAllowance(userAllowance);
          setLoadingData(false);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
          setLoadingData(false);
        }
      } else {
        console.error('MetaMask not detected');
        setLoadingData(false);
      }
    };

    connectToMetaMask();
  }, [account]);

  const tokenize = async () => {
    try {
      if (!upTokenContract || !underlyingTokenContract || !underlyingAmount) return;
      setLoading(true);
      const parsedAmount = ethers.parseUnits(underlyingAmount, await underlyingTokenContract.decimals());
      const tx = await upTokenContract.tokenize(account, parsedAmount);
      setTransactionHash(tx.hash); // Set transaction hash
      await tx.wait(); // Wait for the transaction to be mined
      setTransactionVerified(true); // Set transaction verification status
      setLoading(false);
    } catch (error) {
      console.error('Error tokenizing:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const approveToken = async () => {
    try {
      if (!underlyingTokenContract) return;
      setLoading(true);
      // Approve the upToken to spend underlying tokens
      const tx = await underlyingTokenContract.approve(UP_TOKEN_ADDR, ethers.MaxUint256);
      setTransactionHash(tx.hash); // Set transaction hash
      await tx.wait(); // Wait for the transaction to be mined
      // Refresh allowance after approval
      const userAllowance = await underlyingTokenContract.allowance(account, UP_TOKEN_ADDR);
      setAllowance(userAllowance);
      setTransactionVerified(true); // Set transaction verification status
      setLoading(false);
    } catch (error) {
      console.error('Error approving token:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {account && underlyingTokenAddress && !loadingData ? (
        <>
          <h1 className="mb-4">Tokenize{' '}
            <a href={`https://sepolia.scrollscan.com/address/${underlyingTokenAddress}`} className="ms-2" target="_blank" rel="noopener noreferrer">{underlyingSymbol}</a>{' '}
            into{' '}
            <a href={`https://sepolia.scrollscan.com/address/${UP_TOKEN_ADDR}`} className="ms-2" target="_blank" rel="noopener noreferrer">{upTokenSymbol}
            </a>{' '}
            and{' '}
            <a href={`https://sepolia.scrollscan.com/address/${CAP_TOKEN_ADDR}`} className="ms-2" target="_blank" rel="noopener noreferrer">{capTokenSymbol}</a>
          </h1>
          {allowance.toString() === (ethers.MaxUint256).toString() ? (
            <div className="mb-3">
              <div className="row">
                <div className="col">
                  <p className="fw-bold">⚖️ Your Balances:</p>
                  <p>{ethers.formatUnits(underlyingTokenBal.toString(), underlyingTokenDecimals).toString()} {underlyingSymbol}</p>
                  <p>{ethers.formatUnits(upTokenBal.toString(), underlyingTokenDecimals).toString()} {upTokenSymbol}</p>
                  <p>{ethers.formatUnits(capTokenBal.toString(), underlyingTokenDecimals).toString()} {capTokenSymbol}</p>
                </div>
                <div className="col">
                  <p className="fw-bold">⌛ UpToken Expiry:</p>
                  <p>{new Date(Number(upTokenExpiry) * 1000).toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <p className="fw-bold">📈 UpToken Strike:</p>
                  <p>{upTokenStrike && settlementTokenDecimals ? (ethers.formatUnits(upTokenStrike.toString(), settlementTokenDecimals)).toString() + " " + settlementTokenSymbol : <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>}</p>
                </div>
              </div>
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
              {transactionHash && !transactionVerified && (
                <div className="alert alert-info">
                  Transaction submitted, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                    {transactionHash}
                  </a>
                </div>
              )}
              {transactionVerified && (
                <div className="alert alert-success">
                  Transaction success, Hash: <a href={`https://sepolia.scrollscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                    {transactionHash}
                  </a>
                </div>
              )}
              {error && (
                <div className="alert alert-danger">
                  Error: {error}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-3">
              <button className="btn btn-primary" onClick={approveToken} disabled={loading}>
                {loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Approve'
                )}
              </button>
              <div className="alert alert-warning mt-3" role="alert">
                Please approve the upToken to spend your underlying tokens.
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-warning" role="alert">
          Please connect your wallet or wait while loading...
        </div>
      )}
    </div>
  );
};

export default TokenizePage;
