# Web3 Donation DApp

Aplikasi donasi berbasis Web3 untuk tugas akhir universitas. Project ini terdiri dari frontend (React.js), backend (Node.js/Express.js), dan integrasi smart contract di jaringan Ethereum Sepolia.

## Fitur Utama
- Menampilkan daftar transaksi donasi dari smart contract (Sepolia)
- Koneksi wallet menggunakan MetaMask (Ethers.js)
- Menampilkan saldo wallet yang terhubung
- Backend menyediakan endpoint API dummy (GET /api/transactions)
- UI responsif (CSS Grid/Flexbox)
- Penanganan error saat koneksi wallet gagal

## Cara Instalasi & Menjalankan

### 1. Clone Repository
```
git clone https://github.com/USERNAME/REPO.git
cd web3-dapp-uas
```

### 2. Setup Backend
```
cd backend
npm install
npm start
```

### 3. Setup Frontend
```
cd frontend
npm install
npm run dev
```

### 4. Akses Aplikasi
Buka browser ke alamat yang tertera di terminal (biasanya http://localhost:5173)

## Konfigurasi Smart Contract
- Deploy smart contract ke jaringan Sepolia
- Salin alamat contract ke file konfigurasi frontend
- Pastikan MetaMask terhubung ke jaringan Sepolia

## Struktur Project
- `frontend/` : React.js (Vite), komponen UI, koneksi blockchain
- `backend/`  : Node.js/Express.js, endpoint API dummy
- `smart-contracts/` : Solidity contract (DonationContract.sol)

## Lisensi
MIT

---

> Untuk pertanyaan lebih lanjut, silakan hubungi pengembang melalui GitHub.
