const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, platform, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (platform) where.platform = platform;
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const contests = await prisma.contest.findMany({
      where,
      orderBy: { startTime: 'asc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.contest.count({ where });

    res.json({
      contests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
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
    res.status(500).json({ error: 'Failed to create contest' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contest not found' });
    }
    res.status(500).json({ error: 'Failed to update contest' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contest.delete({
      where: { id }
    });

    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contest not found' });
    }
    res.status(500).json({ error: 'Failed to delete contest' });
  }
});

router.post('/:id/reminder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        contestId: id
      }
    });

    res.status(201).json(reminder);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Reminder already exists' });
    }
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});

router.delete('/:id/reminder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.reminder.delete({
      where: {
        userId_contestId: {
          userId,
          contestId: id
        }
      }
    });

    res.json({ message: 'Reminder removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove reminder' });
  }
});

module.exports = router;