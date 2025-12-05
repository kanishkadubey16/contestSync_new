const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user contest history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await prisma.contestHistory.findMany({
      where: { userId },
      include: {
        contest: {
          select: { name: true, platform: true, startTime: true }
        }
      },
      orderBy: { participatedAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Add contest participation
router.post('/history/add', authenticateToken, async (req, res) => {
  try {
    const { contestName, platform, date, questions } = req.body;
    const userId = req.user.id;

    // Create a manual contest entry
    const contest = await prisma.contest.create({
      data: {
        name: contestName,
        platform: platform,
        startTime: new Date(date),
        duration: 120,
        url: null
      }
    });

    // Add to user's history
    const history = await prisma.contestHistory.create({
      data: {
        userId,
        contestId: contest.id,
        questionsSolved: parseInt(questions),
        participatedAt: new Date(date)
      },
      include: {
        contest: {
          select: { name: true, platform: true, startTime: true }
        }
      }
    });

    res.status(201).json(history);
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
});

// Get total questions solved
router.get('/history/questions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await prisma.contestHistory.aggregate({
      where: { userId },
      _sum: { questionsSolved: true }
    });
    res.json({ totalQuestions: result._sum.questionsSolved || 0 });
  } catch (error) {
    console.error('Error fetching questions count:', error);
    res.status(500).json({ error: 'Failed to fetch questions count' });
  }
});

module.exports = router;