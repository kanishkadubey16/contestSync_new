const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Simple in-memory storage
const users = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Admin login
  if (email === 'admin@gmail.com' && password === 'admin123') {
    return res.json({
      user: { id: '1', email: 'admin@gmail.com', username: 'admin', role: 'ADMIN' },
      token: 'admin-token'
    });
  }
  
  // Check registered users
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return res.json({
      user: { id: user.id, email: user.email, username: user.username, role: 'USER' },
      token: 'user-token'
    });
  }
  
  res.status(400).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  
  console.log('Registration request:', { email, username, password });
  
  // Check if user exists
  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    username,
    password,
    role: 'USER'
  };
  
  users.push(newUser);
  console.log('User registered:', newUser);
  
  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, username: newUser.username, role: 'USER' },
    token: 'new-user-token'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple auth server on http://localhost:${PORT}`);
  console.log('🔑 Admin: admin@gmail.com / admin123');
  console.log('📝 Register any new user');
});