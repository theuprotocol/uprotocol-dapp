import React from 'react';

const Start = () => {
  return (
    <div className="container mt-5">
      <h1 className="display-4">About UProtocol</h1>
      <p className="lead">UProtocol is a DeFi system designed to empower users to tokenize their assets into UpToken and CapToken, enabling sophisticated options trading strategies.</p>

      {/* Integrating the project description content */}
      <div className="mt-5">
        <h2 className="mb-4">Use Case</h2>
        <ul>
          <li>
            <strong>Tokenization of Assets:</strong> UProtocol facilitates the tokenization of assets into two distinct tokens: UpToken and CapToken.
          </li>
          <li>
            <strong>Transfer and Trading:</strong> Both UpToken and CapToken can be freely transferred and traded on the platform, fostering liquidity and price discovery.
          </li>
          <li>
            <strong>Option Exercise:</strong> Holders of UpToken possess the right (but not the obligation) to exercise their option by paying the strike price at any time before the expiry date.
          </li>
          <li>
            <strong>CapToken Mechanism:</strong> CapToken holders will either receive the underlying token back or the settlement price based on the strike price.
          </li>
        </ul>
        <h3>Deployed Contracts</h3>
        <ul>
          <li>Testnet XYZ token: <a href="https://sepolia.scrollscan.com/address/0xB238A96A10A517423a91795F543956dcCeBb8ac3">0xB238A96A10A517423a91795F543956dcCeBb8ac3</a></li>
          <li>Testnet USDC token: <a href="https://sepolia.scrollscan.com/address/0x00b8557652cace2e446a0133e7ad5a311c4fe9ae">0x00b8557652cace2e446a0133e7ad5a311c4fe9ae</a></li>
          <li>Token Factory: <a href="https://sepolia.scrollscan.com/address/0x27055d7f73dc8fe6966e15c6798b685c688ae526#code">0x27055d7f73dc8fe6966e15c6798b685c688ae526</a></li>
          <li>CapToken Implementation: <a href="https://sepolia.scrollscan.com/address/0x6f590eec1e1bff5acd0390324adb635ab224b486">0x6f590eec1e1bff5acd0390324adb635ab224b486</a></li>
          <li>UpToken Implementation: <a href="https://sepolia.scrollscan.com/address/0x2d01192b89dcbd9313d16d784afb536448c1100e">0x2d01192b89dcbd9313d16d784afb536448c1100e</a></li>
        </ul>
      </div>
      <div className="mt-5">
        <img src="img/amm-curve.png" alt="AMM Curve" className="img-fluid" />
      </div>
    </div>
  );
};

export default Start;
