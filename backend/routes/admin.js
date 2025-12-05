const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();


router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            contestHistory: true,
            reminders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


router.get('/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [userCount, contestCount, reminderCount, historyCount] = await Promise.all([
      prisma.user.count(),
      prisma.contest.count(),
      prisma.reminder.count(),
      prisma.contestHistory.count()
    ]);

    res.json({
      users: userCount,
      contests: contestCount,
      reminders: reminderCount,
      participations: historyCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});


router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: { contestHistory: true }
        }
      },
      orderBy: {
        contestHistory: {
          _count: 'desc'
        }
      },
      take: 10
    });

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;