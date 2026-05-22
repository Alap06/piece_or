require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security & Performance ───────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());

// ─── Rate limiting ────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
});

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Static ───────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/pieces', apiLimiter, require('./routes/pieceRoutes'));
app.use('/api/legends', apiLimiter, require('./routes/legendRoutes'));
app.use('/api/contact', apiLimiter, require('./routes/messageRoutes'));
app.use('/api/messages', apiLimiter, require('./routes/messageRoutes'));
app.use('/api/settings', apiLimiter, require('./routes/settingRoutes'));
app.use('/api/admin', apiLimiter, require('./routes/adminRoutes'));

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '✨ Pièces d\'Or de Mahdia API — Running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── 404 ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} introuvable` });
});

// ─── Error handler ────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
