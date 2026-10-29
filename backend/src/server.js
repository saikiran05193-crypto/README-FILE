const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const nodeRoutes = require('./routes/nodeRoutes');
const readingRoutes = require('./routes/readingRoutes');
const riskRoutes = require('./routes/riskRoutes');
const alertRoutes = require('./routes/alertRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://localhost:3000'
];

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Attach Socket.IO to Express app instance
app.set('io', io);

// Global Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[HTTP ${req.method}] ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Environmental Intelligence Network backend is running',
    timestamp: new Date()
  });
});

// Mount API Routes
app.use('/api/sensor-data', sensorDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Socket.IO Events & Diagnostic Logging
io.on('connection', (socket) => {
  const initialTransport = socket.conn ? socket.conn.transport.name : 'unknown';
  console.log(`[Socket.IO] Client connected: ${socket.id} (Transport: ${initialTransport})`);

  if (socket.conn) {
    socket.conn.on('upgrade', (transport) => {
      console.log(`[Socket.IO] Client ${socket.id} upgraded transport to: ${transport.name}`);
    });
  }

  socket.on('emergency-alert', (data) => {
    console.log('[Socket.IO] Direct emergency broadcast event received:', data);
    io.emit('emergency-alert', data);
    io.emit('emergency_alert', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id} (Reason: ${reason})`);
  });
});

process.on('uncaughtException', (err) => {
  console.error('[BACKEND] Uncaught Exception:', err.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[BACKEND] Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[BACKEND ERROR] Port ${PORT} is already in use by another process!`);
    console.error(`Please close any existing process running on port ${PORT} before starting.\n`);
    process.exit(1);
  } else {
    console.error('[BACKEND ERROR]', err);
  }
});

// Initialize Database and Start Server
const startServer = async () => {
  try {
    console.log('[BACKEND] Database connection established');
    await sequelize.authenticate();

    // Sync database models (creates tables automatically if missing)
    await sequelize.sync({ alter: false });
    console.log('[BACKEND] Models synchronized');

    server.listen(PORT, () => {
      console.log(`[BACKEND] Server running on http://localhost:${PORT}`);
      console.log(`[BACKEND] REST API: http://localhost:${PORT}/api`);
      console.log(`[BACKEND] Socket.IO: ws://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[BACKEND] Fatal Startup Error', err);
    process.exit(1);
  }
};

startServer();
