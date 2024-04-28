import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Start from './Start';
import Faucet from './Faucet';
import Tokenize from './Tokenize';
import UpToken from './UpToken';
import CapToken from './CapToken';

const App = () => {
  const [account, setAccount] = useState('');

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Start</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/faucet">Faucet</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/tokenize">Tokenize</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/uptoken">UpToken</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/captoken">CapToken</Link>
                </li>
              </ul>
              {account ? (
                <button className="btn btn-primary me-2">{`${account.slice(0, 5)}...${account.slice(-5)}`}</button>
              ) : (
                <button className="btn btn-primary me-2" onClick={connectToMetaMask}>Connect Wallet</button>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/faucet" element={<Faucet account={account} />} />
          <Route path="/tokenize" element={<Tokenize account={account} />} />
          <Route path="/uptoken" element={<UpToken account={account} />} />
          <Route path="/captoken" element={<CapToken account={account} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
