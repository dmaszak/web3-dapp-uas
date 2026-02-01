/**
 * TransactionList Component
 * 
 * Komponen React untuk menampilkan daftar transaksi/donasi.
 * Data diambil dari:
 * 1. Backend API (data dummy)
 * 2. Smart Contract di blockchain (data real)
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI untuk DonationContract (hanya fungsi yang diperlukan)
const DONATION_CONTRACT_ABI = [
    "function getAllDonations() public view returns (tuple(address donor, uint256 amount, uint256 timestamp, string message)[])",
    "function getDonationCount() public view returns (uint256)",
    "function totalDonations() public view returns (uint256)",
    "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp, string message)"
];

/**
 * Props:
 * @param {object} provider - Ethers.js provider
 * @param {string} contractAddress - Alamat smart contract (opsional)
 */
const TransactionList = ({ provider, contractAddress }) => {
    // ============ State ============
    const [apiTransactions, setApiTransactions] = useState([]);
    const [blockchainDonations, setBlockchainDonations] = useState([]);
    const [isLoadingApi, setIsLoadingApi] = useState(false);
    const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [blockchainError, setBlockchainError] = useState(null);
    const [activeTab, setActiveTab] = useState('api'); // 'api' atau 'blockchain'

    // Backend API URL
    const API_URL = 'http://localhost:5000/api/transactions';

    // ============ Effects ============

    /**
     * Fetch data dari API saat komponen mount
     */
    useEffect(() => {
        fetchApiTransactions();
    }, []);

    /**
     * Fetch data dari blockchain saat provider atau contract address tersedia
     */
    useEffect(() => {
        if (provider && contractAddress) {
            fetchBlockchainDonations();
        }
    }, [provider, contractAddress]);

    // ============ API Functions ============

    /**
     * Mengambil data transaksi dari Backend API
     */
    const fetchApiTransactions = async () => {
        try {
            setIsLoadingApi(true);
            setApiError(null);

            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setApiTransactions(data.data.transactions);
            } else {
                throw new Error(data.error || 'Gagal mengambil data');
            }
        } catch (err) {
            console.error('Error fetching API transactions:', err);
            setApiError(err.message || 'Gagal terhubung ke server');
        } finally {
            setIsLoadingApi(false);
        }
    };

    // ============ Blockchain Functions ============

    /**
     * Mengambil data donasi dari Smart Contract
     */
    const fetchBlockchainDonations = async () => {
        try {
            setIsLoadingBlockchain(true);
            setBlockchainError(null);

            // Buat contract instance
            const contract = new ethers.Contract(
                contractAddress,
                DONATION_CONTRACT_ABI,
                provider
            );

            // Get semua donasi
            const donations = await contract.getAllDonations();

            // Format data
            const formattedDonations = donations.map((donation, index) => ({
                id: index + 1,
                donor: donation.donor,
                amount: ethers.formatEther(donation.amount),
                timestamp: new Date(Number(donation.timestamp) * 1000).toISOString(),
                message: donation.message || 'Tidak ada pesan'
            }));

            setBlockchainDonations(formattedDonations);
        } catch (err) {
            console.error('Error fetching blockchain donations:', err);
            setBlockchainError('Gagal membaca data dari blockchain. Pastikan contract address benar.');
        } finally {
            setIsLoadingBlockchain(false);
        }
    };

    // ============ Helper Functions ============

    /**
     * Format alamat wallet untuk display
     */
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    /**
     * Format tanggal untuk display
     */
    const formatDate = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timestamp;
        }
    };

    // ============ Render Functions ============

    const renderTransactionTable = (transactions, isLoading, error, onRefresh) => {
        if (isLoading) {
            return (
                <div className="loading-state">
                    <p>Loading transactions...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            );
        }

        if (transactions.length === 0) {
            return (
                <div className="empty-state">
                    <p>No transactions yet</p>
                </div>
            );
        }

        return (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Donor</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx, index) => (
                        <tr key={tx.id || index}>
                            <td>{index + 1}</td>
                            <td className="mono" title={tx.donor}>{formatAddress(tx.donor)}</td>
                            <td className="amount">{tx.amount} ETH</td>
                            <td>{formatDate(tx.timestamp)}</td>
                            <td className="message-text">{tx.message || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // ============ Main Render ============

    return (
        <div className="transaction-list">
            <div className="transaction-header">
                <h2>Transaction History</h2>
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
                        onClick={() => setActiveTab('api')}
                    >
                        API Data
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blockchain')}
                        disabled={!contractAddress}
                    >
                        Blockchain
                    </button>
                </div>
            </div>

            <div className="transaction-content">
                {activeTab === 'api' && (
                    <>
                        {renderTransactionTable(
                            apiTransactions, 
                            isLoadingApi, 
                            apiError, 
                            fetchApiTransactions
                        )}
                    </>
                )}

                {activeTab === 'blockchain' && (
                    <>
                        {!contractAddress ? (
                            <div className="empty-state">
                                <p>Contract address not configured</p>
                            </div>
                        ) : (
                            renderTransactionTable(
                                blockchainDonations, 
                                isLoadingBlockchain, 
                                blockchainError, 
                                fetchBlockchainDonations
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
