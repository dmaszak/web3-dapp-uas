/**
 * BalanceDisplay Component
 * 
 * Komponen React untuk menampilkan saldo wallet yang terkoneksi.
 * Menggunakan Ethers.js untuk mengambil balance dari blockchain.
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Props:
 * @param {string} account - Alamat wallet yang terkoneksi
 * @param {object} provider - Ethers.js provider
 */
const BalanceDisplay = ({ account, provider }) => {
    // ============ State ============
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============ Effects ============

    /**
     * Effect untuk mengambil balance saat account atau provider berubah
     */
    useEffect(() => {
        if (account && provider) {
            fetchBalance();
        } else {
            setBalance(null);
        }
    }, [account, provider]);

    // ============ Functions ============

    /**
     * Mengambil balance dari blockchain
     */
    const fetchBalance = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get balance dalam Wei
            const balanceWei = await provider.getBalance(account);
            
            // Convert ke ETH
            const balanceEth = ethers.formatEther(balanceWei);
            
            setBalance(balanceEth);
        } catch (err) {
            console.error('Error fetching balance:', err);
            setError('Gagal mengambil saldo');
        } finally {
            setIsLoading(false);
        }
    };

    const formatBalance = (balance) => {
        if (!balance) return '0.0000';
        const num = parseFloat(balance);
        return num.toFixed(4);
    };

    if (!account) {
        return (
            <div className="balance-display">
                <span className="stat-label">Wallet Balance</span>
                <span className="stat-value balance-empty">Connect wallet to view</span>
            </div>
        );
    }

    return (
        <div className="balance-display">
            <span className="stat-label">Wallet Balance</span>
            
            {isLoading && (
                <span className="stat-value balance-loading">Loading...</span>
            )}

            {error && (
                <div className="balance-error">
                    <span>{error}</span>
                    <button className="btn btn-sm" onClick={fetchBalance}>Retry</button>
                </div>
            )}

            {!isLoading && !error && balance !== null && (
                <>
                    <span className="stat-value">{formatBalance(balance)} ETH</span>
                    <div className="balance-refresh">
                        <button className="btn btn-sm btn-secondary" onClick={fetchBalance}>Refresh</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BalanceDisplay;
