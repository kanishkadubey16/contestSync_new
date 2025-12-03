const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    return response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        name: contest.name,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000),
        duration: contest.durationSeconds / 60,
        url: `https://codeforces.com/contest/${contest.id}`
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

const fetchLeetCodeContests = async () => {
  try {
    const response = await axios.get('https://leetcode.com/contest/api/list/');
    return response.data.contests
      .filter(contest => new Date(contest.start_time * 1000) > new Date())
      .map(contest => ({
        name: contest.title,
        platform: 'LeetCode',
        startTime: new Date(contest.start_time * 1000),
        duration: contest.duration / 60,
        url: `https://leetcode.com/contest/${contest.title_slug}`
      }));
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
};

const fetchKontestsData = async (platform) => {
  try {
    const response = await axios.get(`https://kontests.net/api/v1/${platform}`);
    return response.data.map(contest => ({
      name: contest.name,
      platform: platform.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      startTime: new Date(contest.start_time),
      duration: contest.duration / 60,
      url: contest.url
    }));
  } catch (error) {
    console.error(`Error fetching ${platform} contests:`, error);
    return [];
  }
};

const syncContests = async () => {
  try {
    console.log('Syncing contests...');
    
    const [codeforces, leetcode, atcoder, hackerrank] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetCodeContests(),
      fetchKontestsData('at_coder'),
      fetchKontestsData('hacker_rank')
    ]);
    
    const allContests = [...codeforces, ...leetcode, ...atcoder, ...hackerrank];
    
    // Clear old contests
    await prisma.contest.deleteMany({
      where: { startTime: { lt: new Date() } }
    });
    
    // Insert new contests
    for (const contest of allContests) {
      await prisma.contest.upsert({
        where: { 
          name: contest.name
        },
        update: contest,
        create: contest
      });
    }
    
    console.log(`Synced ${allContests.length} contests`);
  } catch (error) {
    console.error('Error syncing contests:', error);
  }
};

module.exports = { syncContests };