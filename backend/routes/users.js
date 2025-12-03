const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/history', auth, async (req, res) => {
  try {
    const history = await prisma.contestHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/history/add', auth, async (req, res) => {
  try {
    const { contestName, platform, date, questions } = req.body;
    const history = await prisma.contestHistory.create({
      data: {
        userId: req.user.id,
        contestName,
        platform,
        date: new Date(date),
        questions: parseInt(questions)
      }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history/questions', auth, async (req, res) => {
  try {
    const result = await prisma.contestHistory.aggregate({
      where: { userId: req.user.id },
      _sum: { questions: true }
    });
    res.json({ totalQuestions: result._sum.questions || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;