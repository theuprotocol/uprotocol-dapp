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
          <li>
            <strong>Untokenization:</strong> A user who holds both an UpToken and CapToken can "untokenize" back into the underlying any time prior to expiry.
          </li>
        </ul>
        <h3>Smart Contracts</h3>
        <p>All contracts can be found in the following <a href="https://github.com/theuprotocol/uprotocol">repo</a>. In addition, the following contracts have been deployed and verified on sepolia scroll:</p>
        <ul>
          <li>Testnet XYZ token: <a href="https://sepolia.scrollscan.com/address/0xB238A96A10A517423a91795F543956dcCeBb8ac3">0xB238A96A10A517423a91795F543956dcCeBb8ac3</a></li>
          <li>Testnet USDC token: <a href="https://sepolia.scrollscan.com/address/0x00b8557652cace2e446a0133e7ad5a311c4fe9ae">0x00b8557652cace2e446a0133e7ad5a311c4fe9ae</a></li>
          <li>Token Factory: <a href="https://sepolia.scrollscan.com/address/0x27055d7f73dc8fe6966e15c6798b685c688ae526#code">0x27055d7f73dc8fe6966e15c6798b685c688ae526</a></li>
          <li>CapToken Implementation: <a href="https://sepolia.scrollscan.com/address/0x6f590eec1e1bff5acd0390324adb635ab224b486">0x6f590eec1e1bff5acd0390324adb635ab224b486</a></li>
          <li>UpToken Implementation: <a href="https://sepolia.scrollscan.com/address/0x2d01192b89dcbd9313d16d784afb536448c1100e">0x2d01192b89dcbd9313d16d784afb536448c1100e</a></li>
        </ul>
      </div>
            {/* Additional information about the AMM curve */}
        <div className="mt-5">
        <h2>AMM Curve</h2>
        <p>To trade UpTokens and CapTokens, we can define a specialized AMM. Instead of making call options directly tradeable, which can be very sensitive to price and volatility, this AMM focuses on making the CapTokens tradeable vs the underlying token. Depending on the moneyness of the call option (the relationship between its strike price and the underlying asset's price), the CapTokens will exhibit less volatility in the underlying tokens than call options. We can construct an AMM that takes advantage of this by having a low slippage close to a linear segment when the covered call part is almost equal to the underlying, as well as a hyperbolic segment to facilitate trading when the underlying heavily outperforms the covered call (see figure below).</p>
        <div className="mt-5">
        <img src="img/amm-curve.png" alt="AMM Curve" className="img-fluid" />
      </div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">AMM Curve Formula</h5>
            <p>
              AMM Curve Formula: y = a*sqrt(t)*k/x + k - x (x>0)(y>0)
            </p>
            <p>
              where x is the amount of underlying tokens, y is the amount of cap tokens in the pool, t is the time to expiry, a is a scaling factor, and k is the market maker constant given by k_n=x_n*(x_n+y_n)/(a*sqrt(t)+x_n).
            </p>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Alternative Expression</h5>
            <p>
              Alternative Expression: x = (1/2)*(sqrt(4ak*sqrt(t)+k^2+y^2-2ky)+k-y) (x>0)(y>0)
            </p>
            <p>
              To initialize the pool, one can find the point at which the initial amount of underlying tokens and cap tokens is equal. This equilibrium point is given by x_m=(1/2)*(sqrt(k)*sqrt(4a*sqrt(t)+k)+k).
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Price of Underlying Tokens</h5>
            <p>
              Price of Underlying Tokens: y = -a*beta^2*k*sqrt(t)/x^2 - 1 (x>0)
            </p>
            <p>
              To determine the price of underlying tokens in cap tokens, we can simply calculate the derivative, which is given by.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
