const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleUsers = [
  { username: 'alice_coder', email: 'alice@example.com', password: 'password123' },
  { username: 'bob_dev', email: 'bob@example.com', password: 'password123' },
  { username: 'charlie_prog', email: 'charlie@example.com', password: 'password123' },
  { username: 'diana_algo', email: 'diana@example.com', password: 'password123' },
  { username: 'eve_contest', email: 'eve@example.com', password: 'password123' },
  { username: 'frank_code', email: 'frank@example.com', password: 'password123' },
  { username: 'grace_dev', email: 'grace@example.com', password: 'password123' },
  { username: 'henry_prog', email: 'henry@example.com', password: 'password123' }
];

const generateSampleData = async () => {
  try {
    console.log('🔄 Generating sample users...');
    
    // Create sample users
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: 'USER'
        }
      });

      // Add random contest history for each user
      const historyCount = Math.floor(Math.random() * 8) + 2; // 2-10 contests
      const contests = await prisma.contest.findMany({ take: 20 });
      
      for (let i = 0; i < historyCount && i < contests.length; i++) {
        const contest = contests[Math.floor(Math.random() * contests.length)];
        
        try {
          await prisma.contestHistory.create({
            data: {
              userId: user.id,
              contestId: contest.id,
              questionsSolved: Math.floor(Math.random() * 8) + 1, // 1-8 questions
              rank: Math.floor(Math.random() * 1000) + 1,
              participatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            }
          });
        } catch (error) {
          // Skip if duplicate
        }
      }

      // Add random reminders
      const reminderCount = Math.floor(Math.random() * 4); // 0-3 reminders
      for (let i = 0; i < reminderCount && i < contests.length; i++) {
        const contest = contests[Math.floor(Math.random() * contests.length)];
        
        try {
          await prisma.reminder.create({
            data: {
              userId: user.id,
              contestId: contest.id
            }
          });
        } catch (error) {
          // Skip if duplicate
        }
      }
    }

    console.log('✅ Sample data generated successfully');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

module.exports = { generateSampleData };