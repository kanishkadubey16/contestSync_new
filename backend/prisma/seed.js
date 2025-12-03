const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@contestsync.com' },
    update: {},
    create: {
      email: 'admin@contestsync.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@contestsync.com' },
    update: {},
    create: {
      email: 'user@contestsync.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER'
    }
  });

  // Create dummy contests
  const contests = [
    {
      name: 'Codeforces Round #912 (Div. 2)',
      platform: 'Codeforces',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 120,
      url: 'https://codeforces.com/contest/1903'
    },
    {
      name: 'Weekly Contest 375',
      platform: 'LeetCode',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 90,
      url: 'https://leetcode.com/contest/weekly-contest-375'
    },
    {
      name: 'AtCoder Beginner Contest 332',
      platform: 'AtCoder',
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: 100,
      url: 'https://atcoder.jp/contests/abc332'
    },
    {
      name: 'HackerRank Weekly Challenge',
      platform: 'HackerRank',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 180,
      url: 'https://hackerrank.com/contests/weekly-challenge'
    },
    {
      name: 'Educational Codeforces Round 159',
      platform: 'Codeforces',
      startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      duration: 135,
      url: 'https://codeforces.com/contest/1904'
    }
  ];

  for (const contest of contests) {
    await prisma.contest.upsert({
      where: { name: contest.name },
      update: {},
      create: contest
    });
  }

  // Create contest history for user
  const historyData = [
    {
      userId: user.id,
      contestName: 'Codeforces Round #910',
      platform: 'Codeforces',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      questions: 3
    },
    {
      userId: user.id,
      contestName: 'Weekly Contest 373',
      platform: 'LeetCode',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      questions: 2
    },
    {
      userId: user.id,
      contestName: 'AtCoder Beginner Contest 330',
      platform: 'AtCoder',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      questions: 4
    }
  ];

  for (const history of historyData) {
    await prisma.contestHistory.create({
      data: history
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });