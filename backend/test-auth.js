const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test Auth Server Running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Test Auth Server running on http://localhost:${PORT}`);
  console.log(`🔑 Test login: admin@gmail.com / admin123`);
});