const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple Auth Server Running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    console.log('Login successful:', user.email);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.trim() }, { username: username.trim() }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.trim(),
        username: username.trim(),
        password: hashedPassword,
        role: 'USER'
      },
      select: { id: true, email: true, username: true, role: true }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    console.log('Registration successful:', user.email);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log(`🔑 Admin login: admin@gmail.com / admin123`);
  console.log(`📋 Test registration with any new email/username`);
});