const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { setupDatabase } = require('./database-setup');

dotenv.config();

const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const contestService = require('./services/contestService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ContestSync Backend is running' });
});

// Schedule contest sync every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled contest sync...');
  contestService.syncAllContests();
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Check database connection
  const dbReady = await setupDatabase();
  
  if (dbReady) {
    // Initial contest sync on startup
    console.log('🔄 Starting contest sync...');
    contestService.syncAllContests();
  } else {
    console.log('⚠️  Database not ready. Please check your DATABASE_URL in .env');
  }
});