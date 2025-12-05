const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const contestTemplates = [
  {
    names: ['Weekly Contest', 'Biweekly Contest', 'Monthly Challenge', 'Global Round', 'Educational Round'],
    platforms: ['Codeforces', 'LeetCode', 'AtCoder', 'HackerRank', 'CodeChef']
  }
];

const generateRandomContest = () => {
  const platforms = ['Codeforces', 'LeetCode', 'AtCoder', 'HackerRank', 'CodeChef'];
  const contestTypes = ['Weekly Contest', 'Biweekly Contest', 'Monthly Challenge', 'Global Round', 'Educational Round', 'Div 2 Contest', 'Div 1 Contest'];
  
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const type = contestTypes[Math.floor(Math.random() * contestTypes.length)];
  const number = Math.floor(Math.random() * 500) + 1;
  
  const name = `${platform} ${type} ${number}`;
  
  // Generate random start time (next 30 days)
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  
  // Round to nearest hour
  futureDate.setMinutes(0, 0, 0);
  
  const durations = [90, 120, 150, 180, 240]; // minutes
  const duration = durations[Math.floor(Math.random() * durations.length)];
  
  const urls = {
    'Codeforces': `https://codeforces.com/contest/${Math.floor(Math.random() * 2000)}`,
    'LeetCode': `https://leetcode.com/contest/weekly-contest-${number}`,
    'AtCoder': `https://atcoder.jp/contests/abc${number}`,
    'HackerRank': `https://www.hackerrank.com/contests/contest-${number}`,
    'CodeChef': `https://www.codechef.com/contests/contest-${number}`
  };
  
  return {
    name,
    platform,
    startTime: futureDate,
    duration,
    url: urls[platform]
  };
};

const generateContests = async (count = 20) => {
  try {
    // Clear existing contests
    await prisma.contest.deleteMany({});
    
    const contests = [];
    for (let i = 0; i < count; i++) {
      contests.push(generateRandomContest());
    }
    
    // Sort by start time
    contests.sort((a, b) => a.startTime - b.startTime);
    
    await prisma.contest.createMany({
      data: contests
    });
    
    console.log(`✅ Generated ${count} contests`);
    return contests;
  } catch (error) {
    console.error('Error generating contests:', error);
    throw error;
  }
};

module.exports = { generateContests };