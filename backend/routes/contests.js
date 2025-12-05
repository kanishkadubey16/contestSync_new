const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get contests with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, platform, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (platform) where.platform = platform;
    if (search) {
      where.name = {
        contains: search
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
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// Set reminder
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

    res.status(201).json({ message: 'Reminder set successfully', reminder });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Reminder already exists' });
    }
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
});

// Remove reminder
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

    res.json({ message: 'Reminder removed successfully' });
  } catch (error) {
    console.error('Error removing reminder:', error);
    res.status(500).json({ error: 'Failed to remove reminder' });
  }
});

module.exports = router;