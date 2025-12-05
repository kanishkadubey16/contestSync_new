const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;

// In-memory users for testing
const users = [
  {
    id: '1',
    email: 'admin@gmail.com',
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'ADMIN'
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth server running' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, 'secret-key');
    
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

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log('Registration attempt:', { email, username });
    
    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      role: 'USER'
    };
    
    users.push(newUser);
    
    const token = jwt.sign({ userId: newUser.id }, 'secret-key');
    
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Auth server running on http://localhost:${PORT}`);
  console.log(`🔑 Login: admin@gmail.com / admin123`);
});