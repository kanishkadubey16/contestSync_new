const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { generateContests } = require('./services/contestGenerator');
const { generateSampleData } = require('./services/sampleDataGenerator');
const { checkAndSendReminders } = require('./services/reminderService');

dotenv.config();

const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ContestSync Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('📝 Admin login: admin@gmail.com / admin123');
  
  // Auto-generate contests and sample data on startup
  try {
    await generateContests(25);
    console.log('🏆 Auto-generated 25 contests');
    
    await generateSampleData();
    console.log('👥 Generated sample users and data');
  } catch (error) {
    console.error('Failed to generate data:', error.message);
  }
  
  // Schedule reminder checks every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    console.log('🔔 Checking for contest reminders...');
    checkAndSendReminders();
  });
  
  console.log('📧 Email reminder system activated');
  console.log('🔔 Reminders will be sent 1 hour before contests start');
});