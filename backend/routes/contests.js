const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { platform, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {
      startTime: { gte: new Date() },
      ...(platform && { platform }),
      ...(search && { name: { contains: search, mode: 'insensitive' } })
    };
    
    const [contests, total] = await Promise.all([
      prisma.contest.findMany({
        where,
        orderBy: { startTime: 'asc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contest.count({ where })
    ]);
    
    res.json({ contests, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
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
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: 'Contest creation failed' });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, platform, startTime, duration, url } = req.body;
    const contest = await prisma.contest.update({
      where: { id: req.params.id },
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
    res.status(400).json({ error: 'Contest update failed' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await prisma.contest.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contest deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/reminder', auth, async (req, res) => {
  try {
    const reminder = await prisma.reminder.create({
      data: {
        userId: req.user.id,
        contestId: req.params.id
      }
    });
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: 'Reminder already exists' });
  }
});

router.delete('/:id/reminder', auth, async (req, res) => {
  try {
    await prisma.reminder.delete({
      where: {
        userId_contestId: {
          userId: req.user.id,
          contestId: req.params.id
        }
      }
    });
    res.json({ message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/alerts', auth, async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.user.id },
      include: { contest: true }
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;