/**
 * Backend Server - Web3 Donation DApp
 * 
 * Server Express.js untuk menyediakan RESTful API
 * yang mengembalikan data transaksi dummy dalam format JSON
 */

const express = require('express');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============ Middleware ============

// Enable CORS untuk frontend (React berjalan di port berbeda)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Parse JSON request body
app.use(express.json());

// ============ Routes ============

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Web3 Donation DApp API Server',
        version: '1.0.0',
        endpoints: {
            transactions: '/api/transactions',
            health: '/'
        }
    });
});

// Transactions API routes
app.use('/api/transactions', transactionsRouter);

// ============ Error Handling ============

// 404 Handler - Route tidak ditemukan
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint tidak ditemukan',
        path: req.originalUrl
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan pada server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============ Start Server ============

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   Web3 Donation DApp - Backend Server         ║
    ╠═══════════════════════════════════════════════╣
    ║   Status  : Running                           ║
    ║   Port    : ${PORT}                              ║
    ║   API     : http://localhost:${PORT}/api          ║
    ╚═══════════════════════════════════════════════╝
    `);
});

module.exports = app;
