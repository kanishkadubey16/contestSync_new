const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Make prisma available globally
global.prisma = prisma;

app.use(cors({
    origin : "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const { syncContests } = require('./services/contestSync');

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Sync contests every hour
cron.schedule('0 * * * *', syncContests);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));