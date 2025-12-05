const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// In-memory data
const users = [
  { id: '1', email: 'admin@gmail.com', username: 'admin', password: 'admin123', role: 'ADMIN' },
  { id: '2', email: 'alice@test.com', username: 'alice_coder', password: 'test123', role: 'USER' },
  { id: '3', email: 'bob@test.com', username: 'bob_dev', password: 'test123', role: 'USER' },
  { id: '4', email: 'charlie@test.com', username: 'charlie_prog', password: 'test123', role: 'USER' },
  { id: '5', email: 'diana@test.com', username: 'diana_algo', password: 'test123', role: 'USER' }
];

const contests = [
  { id: '1', name: 'Codeforces Round 912 (Div. 2)', platform: 'Codeforces', startTime: new Date(Date.now() + 2*60*60*1000).toISOString(), duration: 120, url: 'https://codeforces.com/contest/1900' },
  { id: '2', name: 'LeetCode Weekly Contest 372', platform: 'LeetCode', startTime: new Date(Date.now() + 5*60*60*1000).toISOString(), duration: 90, url: 'https://leetcode.com/contest/weekly-contest-372' },
  { id: '3', name: 'AtCoder Beginner Contest 330', platform: 'AtCoder', startTime: new Date(Date.now() + 8*60*60*1000).toISOString(), duration: 100, url: 'https://atcoder.jp/contests/abc330' },
  { id: '4', name: 'HackerRank Weekly Contest', platform: 'HackerRank', startTime: new Date(Date.now() + 12*60*60*1000).toISOString(), duration: 180, url: 'https://hackerrank.com/contests/weekly' },
  { id: '5', name: 'CodeChef Starters 112', platform: 'CodeChef', startTime: new Date(Date.now() + 24*60*60*1000).toISOString(), duration: 150, url: 'https://codechef.com/START112' },
  { id: '6', name: 'Codeforces Educational Round 159', platform: 'Codeforces', startTime: new Date(Date.now() + 36*60*60*1000).toISOString(), duration: 135, url: 'https://codeforces.com/contest/1901' },
  { id: '7', name: 'LeetCode Biweekly Contest 118', platform: 'LeetCode', startTime: new Date(Date.now() + 48*60*60*1000).toISOString(), duration: 90, url: 'https://leetcode.com/contest/biweekly-contest-118' },
  { id: '8', name: 'AtCoder Regular Contest 168', platform: 'AtCoder', startTime: new Date(Date.now() + 60*60*60*1000).toISOString(), duration: 120, url: 'https://atcoder.jp/contests/arc168' },
  { id: '9', name: 'HackerRank Algorithms Contest', platform: 'HackerRank', startTime: new Date(Date.now() + 72*60*60*1000).toISOString(), duration: 240, url: 'https://hackerrank.com/contests/algorithms' },
  { id: '10', name: 'CodeChef Long Challenge', platform: 'CodeChef', startTime: new Date(Date.now() + 84*60*60*1000).toISOString(), duration: 180, url: 'https://codechef.com/LONG' },
  { id: '11', name: 'Codeforces Global Round 27', platform: 'Codeforces', startTime: new Date(Date.now() + 96*60*60*1000).toISOString(), duration: 150, url: 'https://codeforces.com/contest/1902' },
  { id: '12', name: 'LeetCode Weekly Contest 373', platform: 'LeetCode', startTime: new Date(Date.now() + 108*60*60*1000).toISOString(), duration: 90, url: 'https://leetcode.com/contest/weekly-contest-373' }
];

const contestHistory = [
  { id: '1', userId: '2', contestId: '1', questionsSolved: 3, participatedAt: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
  { id: '2', userId: '2', contestId: '2', questionsSolved: 2, participatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
  { id: '3', userId: '3', contestId: '1', questionsSolved: 4, participatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
  { id: '4', userId: '3', contestId: '3', questionsSolved: 5, participatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
  { id: '5', userId: '4', contestId: '2', questionsSolved: 1, participatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
  { id: '6', userId: '4', contestId: '4', questionsSolved: 6, participatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
  { id: '7', userId: '5', contestId: '1', questionsSolved: 2, participatedAt: new Date(Date.now() - 6*24*60*60*1000).toISOString() }
];

const reminders = [
  { id: '1', userId: '2', contestId: '3' },
  { id: '2', userId: '3', contestId: '4' },
  { id: '3', userId: '4', contestId: '5' },
  { id: '4', userId: '5', contestId: '6' },
  { id: '5', userId: '2', contestId: '7' }
];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      token: `token-${user.id}`
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  
  console.log('📝 Registration attempt:', { email, username });
  
  if (users.find(u => u.email === email || u.username === username)) {
    console.log('❌ User already exists');
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: Date.now().toString(),
    email, username, password,
    role: 'USER'
  };
  
  users.push(newUser);
  console.log('✅ User registered successfully:', newUser.username);
  console.log('👥 Total users now:', users.length);
  
  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, username: newUser.username, role: 'USER' },
    token: `token-${newUser.id}`
  });
});

// Contest endpoints
app.get('/api/contests', (req, res) => {
  const { page = 1, limit = 10, platform, search } = req.query;
  let filteredContests = contests;
  
  if (platform) {
    filteredContests = filteredContests.filter(c => c.platform === platform);
  }
  
  if (search) {
    filteredContests = filteredContests.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  res.json({
    contests: filteredContests,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: filteredContests.length, pages: 1 }
  });
});

// User endpoints
app.get('/api/user/history', (req, res) => {
  const userId = getUserIdFromToken(req);
  const userHistory = contestHistory
    .filter(h => h.userId === userId)
    .map(h => ({
      ...h,
      contest: contests.find(c => c.id === h.contestId)
    }));
  
  res.json(userHistory);
});

app.post('/api/user/history/add', (req, res) => {
  const userId = getUserIdFromToken(req);
  const { contestName, platform, date, questions } = req.body;
  
  const newHistory = {
    id: Date.now().toString(),
    userId,
    contestId: 'manual-' + Date.now(),
    questionsSolved: parseInt(questions),
    participatedAt: new Date(date).toISOString(),
    contest: { name: contestName, platform }
  };
  
  contestHistory.push(newHistory);
  res.status(201).json(newHistory);
});

app.get('/api/user/history/questions', (req, res) => {
  const userId = getUserIdFromToken(req);
  const total = contestHistory
    .filter(h => h.userId === userId)
    .reduce((sum, h) => sum + h.questionsSolved, 0);
  
  res.json({ totalQuestions: total });
});

// Admin endpoints
app.get('/api/admin/overview', (req, res) => {
  res.json({
    users: users.length,
    contests: contests.length,
    reminders: reminders.length,
    participations: contestHistory.length
  });
});

app.get('/api/admin/users', (req, res) => {
  const usersWithCounts = users.map(user => ({
    ...user,
    _count: {
      contestHistory: contestHistory.filter(h => h.userId === user.id).length,
      reminders: reminders.filter(r => r.userId === user.id).length
    }
  }));
  
  res.json(usersWithCounts);
});

app.get('/api/admin/leaderboard', (req, res) => {
  const leaderboard = users.map(user => ({
    id: user.id,
    username: user.username,
    _count: {
      contestHistory: contestHistory.filter(h => h.userId === user.id).length,
      reminders: reminders.filter(r => r.userId === user.id).length
    }
  })).sort((a, b) => b._count.contestHistory - a._count.contestHistory);
  
  res.json(leaderboard);
});

app.get('/api/admin/contests', (req, res) => {
  res.json(contests);
});

app.post('/api/admin/contests', (req, res) => {
  const newContest = {
    id: Date.now().toString(),
    ...req.body
  };
  contests.push(newContest);
  res.status(201).json(newContest);
});

app.delete('/api/admin/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index > -1) {
    users.splice(index, 1);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Helper function
function getUserIdFromToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  return token ? token.replace('token-', '') : '2'; // Default to user 2
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Complete server running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Complete server running on http://localhost:${PORT}`);
  console.log('🔑 Login: admin@gmail.com / admin123');
  console.log('👤 Or: alice@test.com / test123');
  console.log('📊 All features: contests, history, admin panel');
});