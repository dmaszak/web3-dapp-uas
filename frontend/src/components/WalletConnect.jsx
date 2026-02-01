/**
 * WalletConnect Component
 * 
 * Komponen React untuk menghubungkan wallet MetaMask ke aplikasi.
 * Menangani koneksi, disconnect, dan error handling.
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Props:
 * @param {function} onAccountChange - Callback saat account berubah
 * @param {function} onProviderChange - Callback saat provider tersedia
 */
const WalletConnect = ({ onAccountChange, onProviderChange }) => {
    // ============ State ============
    const [account, setAccount] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [chainId, setChainId] = useState(null);

    // Sepolia Chain ID
    const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

    // ============ Effects ============

    /**
     * Effect untuk mengecek apakah wallet sudah terkoneksi sebelumnya
     */
    useEffect(() => {
        checkIfWalletIsConnected();
        
        // Listen untuk perubahan account
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        // Cleanup listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    // ============ Handler Functions ============

    /**
     * Mengecek apakah wallet sudah terkoneksi
     */
    const checkIfWalletIsConnected = async () => {
        try {
            // Cek apakah MetaMask terinstall
            if (!window.ethereum) {
                setError('MetaMask tidak terdeteksi! Silakan install MetaMask.');
                return;
            }

            // Cek akun yang sudah terkoneksi
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                onAccountChange?.(accounts[0]);
                
                // Setup provider
                const provider = new ethers.BrowserProvider(window.ethereum);
                onProviderChange?.(provider);
                
                // Get current chain
                const network = await provider.getNetwork();
                setChainId(network.chainId.toString());
            }
        } catch (err) {
            console.error('Error checking wallet connection:', err);
        }
    };

    /**
     * Handle perubahan akun
     */
    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            // User disconnect wallet
            setAccount(null);
            onAccountChange?.(null);
            setError('Wallet terputus');
        } else {
            setAccount(accounts[0]);
            onAccountChange?.(accounts[0]);
            setError(null);
        }
    };

    /**
     * Handle perubahan network/chain
     */
    const handleChainChanged = () => {
        // Reload halaman saat network berubah (best practice)
        window.location.reload();
    };

    /**
     * Koneksi ke wallet MetaMask
     */
    const connectWallet = async () => {
        try {
            setIsConnecting(true);
            setError(null);

            // Cek MetaMask
            if (!window.ethereum) {
                throw new Error('MetaMask tidak terdeteksi! Silakan install MetaMask dari https://metamask.io');
            }

            // Request akses ke akun
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                setAccount(accounts[0]);
                onAccountChange?.(accounts[0]);

                // Setup provider
                const provider = new ethers.BrowserProvider(window.ethereum);
                onProviderChange?.(provider);

                // Get current chain
                const network = await provider.getNetwork();
                setChainId(network.chainId.toString());

                // Cek apakah di Sepolia
                if (network.chainId !== 11155111n) {
                    await switchToSepolia();
                }
            }
        } catch (err) {
            console.error('Error connecting wallet:', err);
            
            // Handle specific errors
            if (err.code === 4001) {
                setError('Koneksi dibatalkan oleh user');
            } else if (err.code === -32002) {
                setError('Request sudah pending. Cek MetaMask Anda.');
            } else {
                setError(err.message || 'Gagal terhubung ke wallet');
            }
        } finally {
            setIsConnecting(false);
        }
    };

    /**
     * Switch ke Sepolia Testnet
     */
    const switchToSepolia = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: SEPOLIA_CHAIN_ID }]
            });
        } catch (switchError) {
            // Chain belum ditambahkan, tambahkan Sepolia
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: SEPOLIA_CHAIN_ID,
                            chainName: 'Sepolia Testnet',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://rpc.sepolia.org'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }]
                    });
                } catch (addError) {
                    setError('Gagal menambahkan Sepolia network');
                }
            }
        }
    };

    /**
     * Disconnect wallet
     */
    const disconnectWallet = () => {
        setAccount(null);
        setChainId(null);
        onAccountChange?.(null);
        onProviderChange?.(null);
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="wallet-connect">
            {error && (
                <div className="wallet-error">
                    <span>{error}</span>
                    <button className="error-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {account ? (
                <div className="wallet-status">
                    <div className="wallet-info">
                        <div className="wallet-avatar"></div>
                        <div className="wallet-details">
                            <span className="wallet-label">Connected</span>
                            <span className="wallet-address">{formatAddress(account)}</span>
                        </div>
                    </div>
                    <button className="btn btn-secondary" onClick={disconnectWallet}>
                        Disconnect
                    </button>
                </div>
            ) : (
                <button 
                    className="btn btn-primary"
                    onClick={connectWallet}
                    disabled={isConnecting}
                    style={{ width: '100%' }}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
