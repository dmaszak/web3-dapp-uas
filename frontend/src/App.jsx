/**
 * App.jsx - Web3 Donation DApp
 */

import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import BalanceDisplay from './components/BalanceDisplay';
import TransactionList from './components/TransactionList';
import DonationForm from './components/DonationForm';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  
  // Smart Contract Address - Sepolia Testnet
  const CONTRACT_ADDRESS = '0x9700493119a4b4A8959aA67b0c083dF6DE233D80';

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1>DonateChain</h1>
            <p>Decentralized Donation Platform</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="network-badge">
            <span className="network-dot"></span>
            Sepolia
          </div>
          <WalletConnect 
            onAccountChange={handleAccountChange}
            onProviderChange={handleProviderChange}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="stat-info">
              <BalanceDisplay account={account} provider={provider} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Network</span>
              <span className="stat-value">Sepolia Testnet</span>
              <span className="stat-badge success">Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Smart Contract</span>
              <span className="stat-value mono">
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </span>
              <span className="stat-badge">Deployed</span>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="content-section" style={{marginBottom: '24px'}}>
          <DonationForm 
            provider={provider}
            contractAddress={CONTRACT_ADDRESS}
            onSuccess={() => window.location.reload()}
          />
        </section>

        {/* Transaction List */}
        <section className="content-section">
          <TransactionList 
            provider={provider}
            contractAddress={CONTRACT_ADDRESS}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>DonateChain © 2026 · Built with React, Ethers.js & Solidity</p>
        <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer">
          Get Testnet ETH
        </a>
      </footer>
    </div>
  );
}

export default App;
