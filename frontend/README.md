# 💝 Web3 Donation DApp

Aplikasi donasi terdesentralisasi berbasis blockchain Ethereum. Proyek ini dibuat sebagai tugas UAS mata kuliah Pengembangan Full-Stack dengan Integrasi Blockchain.

![Web3](https://img.shields.io/badge/Web3-Ethereum-blueviolet)
![React](https://img.shields.io/badge/Frontend-React-61dafb)
![Node.js](https://img.shields.io/badge/Backend-Express.js-green)
![Solidity](https://img.shields.io/badge/Smart%20Contract-Solidity-363636)

## 📋 Deskripsi Proyek

Aplikasi ini merupakan Web3 DApp (Decentralized Application) yang memungkinkan pengguna untuk:
- 🦊 Menghubungkan wallet MetaMask
- 💰 Melihat saldo wallet yang terkoneksi
- 📋 Melihat daftar transaksi donasi dari smart contract dan API
- 🔗 Berinteraksi dengan blockchain Ethereum (Sepolia Testnet)

## 🏗️ Struktur Proyek

```
web3-dapp-uas/
├── backend/
│   ├── server.js                 # Express.js server
│   ├── package.json
│   ├── routes/
│   │   └── transactions.js       # API endpoint transaksi
│   └── smart-contracts/
│       └── DonationContract.sol  # Smart contract Solidity
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Komponen utama
    │   ├── App.css               # Styling (Flexbox/Grid)
    │   └── components/
    │       ├── WalletConnect.jsx     # Koneksi MetaMask
    │       ├── BalanceDisplay.jsx    # Tampilan saldo
    │       └── TransactionList.jsx   # Daftar transaksi
    ├── package.json
    └── README.md
```

## 🚀 Langkah Instalasi

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [MetaMask](https://metamask.io/) extension di browser
- Sepolia ETH untuk testing (gratis dari [Sepolia Faucet](https://sepoliafaucet.com))

### 1. Clone Repository
```bash
git clone <repository-url>
cd web3-dapp-uas
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```
Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### 4. Deploy Smart Contract (Opsional)

1. Buka [Remix IDE](https://remix.ethereum.org)
2. Buat file baru dan paste kode dari `backend/smart-contracts/DonationContract.sol`
3. Compile dengan Solidity versi `0.8.19` atau lebih baru
4. Connect MetaMask ke **Sepolia Testnet**
5. Deploy contract
6. Copy **contract address** yang dihasilkan
7. Paste ke `frontend/src/App.jsx` di variabel `CONTRACT_ADDRESS`

```jsx
const CONTRACT_ADDRESS = '0xYOUR_CONTRACT_ADDRESS_HERE';
```

## 🔧 Fitur

### Frontend (React.js)
| Komponen | Fungsi |
|----------|--------|
| `WalletConnect` | Menghubungkan wallet MetaMask dengan error handling |
| `BalanceDisplay` | Menampilkan saldo ETH wallet yang terkoneksi |
| `TransactionList` | Menampilkan daftar transaksi dari API & blockchain |

### Backend (Express.js)
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/` | GET | Health check & info API |
| `/api/transactions` | GET | Mengambil semua transaksi dummy |
| `/api/transactions/:id` | GET | Mengambil transaksi by ID |

### Smart Contract (Solidity)
| Fungsi | Deskripsi |
|--------|-----------|
| `donate(message)` | Menerima donasi ETH dengan pesan |
| `getAllDonations()` | Mengambil semua data donasi |
| `getDonationCount()` | Mengambil jumlah donasi |
| `getContractBalance()` | Mengambil saldo contract |
| `withdraw(amount)` | Menarik dana (hanya owner) |

## 🌐 Teknologi yang Digunakan

- **Frontend**: React.js, Vite, Ethers.js
- **Backend**: Node.js, Express.js
- **Blockchain**: Ethereum (Sepolia Testnet), Solidity
- **Wallet**: MetaMask
- **Styling**: CSS (Flexbox & Grid)

## 📱 Responsif Design

Aplikasi menggunakan CSS Flexbox dan Grid untuk tampilan yang responsif di berbagai ukuran layar:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## ⚠️ Error Handling

Aplikasi menangani berbagai kondisi error:
- MetaMask tidak terinstall
- User menolak koneksi wallet
- Request sudah pending
- Network salah (bukan Sepolia)
- Gagal fetch data dari API/blockchain

## 📄 Lisensi

MIT License - Bebas digunakan untuk pembelajaran.

---

**Dibuat untuk UAS Pengembangan Full-Stack dengan Integrasi Blockchain**
