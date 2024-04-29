import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UP_TOKEN_ADDR, UP_TOKEN_ABI, MockERC20_ABI } from './smartContracts'; // Import contract ABI and address

const UpTokenPage = ({ account }) => {
  const [, setProvider] = useState(null);
  const [upTokenContract, setUpTokenContract] = useState(null);
  const [upTokenSymbol, setUpTokenSymbol] = useState(null);
  const [settlementTokenAddress, setSettlementTokenAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountToExercise, setAmountToExercise] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [settlementTokenContract, setSettlementTokenContract] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionVerified, setTransactionVerified] = useState(false);
  const [upTokenStrike, setUpTokenStrike] = useState(null);
  const [upTokenExpiry, setUpTokenExpiry] = useState(null);
  const [upTokenBalance, setUpTokenBalance] = useState(null);
  const [settlementTokenBalance, setSettlementTokenBalance] = useState(null);
  const [decimalsOfUnderlying, setDecimalsOfUnderlying] = useState(null);
  const [loadingData, setLoadingData] = useState(true); // New state variable to track loading data

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (account) {
        try {
          setLoadingData(true)
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          const upTokenContract = new ethers.Contract(UP_TOKEN_ADDR, UP_TOKEN_ABI, signer);
          setUpTokenStrike(await upTokenContract.strike());
          setUpTokenContract(upTokenContract);
          setUpTokenSymbol(await upTokenContract.symbol());
          setSettlementTokenAddress(await upTokenContract.settlementToken());
          const settlementTokenContract = new ethers.Contract(await upTokenContract.settlementToken(), MockERC20_ABI, signer);
          const userAllowance = await settlementTokenContract.allowance(account, UP_TOKEN_ADDR);
          setSettlementTokenContract(settlementTokenContract);
          setAllowance(userAllowance);

          // Fetch strike price, expiry, balance, and decimals of underlying
          const underlyingDecimals = await upTokenContract.decimals();
          setUpTokenExpiry(await upTokenContract.expiry());
          setUpTokenBalance(await upTokenContract.balanceOf(account));
          setDecimalsOfUnderlying(underlyingDecimals);

          // Fetch settlement token balance
          const settlementTokenBalance = await settlementTokenContract.balanceOf(account);
          setSettlementTokenBalance(settlementTokenBalance);
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

  const exerciseTokens = async () => {
    try {
      if (!upTokenContract || !amountToExercise || amountToExercise <= 0) return;
      setLoading(true);
      const tx = await upTokenContract.exercise(account, ethers.parseUnits(amountToExercise.toString(), 18));
      setTransactionHash(tx.hash);
      await tx.wait(); // Wait for the transaction to be mined
      setTransactionVerified(true);
      setLoading(false);
    } catch (error) {
      console.error('Error exercising tokens:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const approveMaxAllowance = async () => {
    try {
      if (!settlementTokenAddress) return;
      setLoading(true);
      const tx = await settlementTokenContract.approve(UP_TOKEN_ADDR, ethers.MaxUint256);
      await tx.wait(); // Wait for the transaction to be mined
      setAllowance(ethers.MaxUint256);
      setLoading(false);
    } catch (error) {
      console.error('Error approving max allowance:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  console.log(upTokenStrike, amountToExercise)
  const impliedPayAmount = upTokenStrike && amountToExercise ? (ethers.formatUnits(upTokenStrike * ethers.toBigInt(amountToExercise.toString()), 6)).toString() : null;
  console.log(impliedPayAmount)

  return (
    <div className="container mt-5">
      {account && !loadingData ? (
        <>
          <h1 className="mb-4">Exercise {upTokenSymbol}</h1>
          {allowance.toString() == (ethers.MaxUint256).toString() ? (
            <div className="mb-3">
              <div className="row">
                <div className="col">
                  <p className="fw-bold">⚖️ Your Balances:</p>
                  <p>UpToken: {ethers.formatUnits(upTokenBalance, decimalsOfUnderlying)}</p>
                  <p>Settlement Token: {ethers.formatUnits(settlementTokenBalance.toString(), 6)}</p>
                </div>
                <div className="col">
                  <p className="fw-bold">⌛ UpToken Expiry:</p>
                  <p>{upTokenExpiry && new Date(Number(upTokenExpiry) * 1000).toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <p className="fw-bold">📈 UpToken Strike:</p>
                  <p>{upTokenStrike && ethers.formatUnits(upTokenStrike.toString(), 6)}</p>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount to Exercise"
                  value={amountToExercise}
                  onChange={(e) => setAmountToExercise(e.target.value)}
                />
                <button className="btn btn-primary" onClick={exerciseTokens} disabled={loading}>
                  {loading ? (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    'Exercise Tokens'
                  )}
                </button>
              </div>
              <p className="fw-bold">💰 Implied Pay Amount:</p>
              <p>{impliedPayAmount}</p>
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
              <button className="btn btn-primary" onClick={approveMaxAllowance} disabled={loading}>
                {loading ? (
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Approve Max Allowance'
                )}
              </button>
              <div className="alert alert-warning mt-3" role="alert">
                Please approve the maximum allowance for the settlement token to the UpToken contract.
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

export default UpTokenPage;
