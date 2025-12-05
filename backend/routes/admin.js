const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users
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
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get system overview
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
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: { 
            contestHistory: true,
            reminders: true
          }
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
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get all contests for admin
router.get('/contests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { startTime: 'asc' },
      take: 100
    });
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// Add new contest
router.post('/contests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, platform, startTime, duration, url } = req.body;
    
    const contest = await prisma.contest.create({
      data: {
        name,
        platform,
        startTime: new Date(startTime),
        duration: parseInt(duration),
        url
      }
    });
    
    res.status(201).json(contest);
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ error: 'Failed to create contest' });
  }
});

// Update contest
router.put('/contests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, platform, startTime, duration, url } = req.body;
    
    const contest = await prisma.contest.update({
      where: { id },
      data: {
        name,
        platform,
        startTime: new Date(startTime),
        duration: parseInt(duration),
        url
      }
    });
    
    res.json(contest);
  } catch (error) {
    console.error('Error updating contest:', error);
    res.status(500).json({ error: 'Failed to update contest' });
  }
});

// Delete contest
router.delete('/contests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.contest.delete({
      where: { id }
    });
    
    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    console.error('Error deleting contest:', error);
    res.status(500).json({ error: 'Failed to delete contest' });
  }
});

module.exports = router;