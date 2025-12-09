const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/history/add', authenticateToken, async (req, res) => {
  try {
    const { contestId, contestName, platform, date, rank, questionsSolved } = req.body;
    const userId = req.user.id;

    let finalContestId = contestId;

    // If manual entry, create a contest first
    if (!contestId || contestId.startsWith('manual-')) {
      const contest = await prisma.contest.create({
        data: {
          name: contestName || 'Manual Entry',
          platform: platform || 'Manual',
          startTime: date ? new Date(date) : new Date(),
          duration: 0,
          url: null
        }
      });
      finalContestId = contest.id;
    }

    const history = await prisma.contestHistory.create({
      data: {
        userId,
        contestId: finalContestId,
        rank: rank || null,
        questionsSolved: questionsSolved || 0
      }
    });

    res.status(201).json(history);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Contest already in history' });
    }
    console.error('Error adding history:', error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
});

router.get('/history/questions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.contestHistory.aggregate({
      where: { userId },
      _sum: { questionsSolved: true }
    });

    res.json({ totalQuestions: result._sum.questionsSolved || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions count' });
  }
});

module.exports = router;