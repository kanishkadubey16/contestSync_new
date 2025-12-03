const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/reminders', auth, adminAuth, async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      include: { user: { select: { name: true, email: true } }, contest: true }
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/overview', auth, adminAuth, async (req, res) => {
  try {
    const [userCount, reminderCount, questionsSum] = await Promise.all([
      prisma.user.count(),
      prisma.reminder.count(),
      prisma.contestHistory.aggregate({ _sum: { questions: true } })
    ]);
    
    res.json({
      totalUsers: userCount,
      totalReminders: reminderCount,
      totalQuestions: questionsSum._sum.questions || 0,
      lastSync: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { reminders: true, history: true } }
      },
      orderBy: { history: { _count: 'desc' } },
      take: 10
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;