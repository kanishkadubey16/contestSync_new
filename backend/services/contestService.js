const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CONTEST_APIS = {
  codeforces: 'https://codeforces.com/api/contest.list',
  leetcode: 'https://leetcode.com/contest/api/list/',
  atcoder: 'https://kontests.net/api/v1/at_coder',
  hackerrank: 'https://kontests.net/api/v1/hacker_rank'
};

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get(CONTEST_APIS.codeforces);
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
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
};

const fetchKontestsData = async (platform, apiUrl) => {
  try {
    const response = await axios.get(apiUrl);
    return response.data.map(contest => ({
      name: contest.name,
      platform: platform,
      startTime: new Date(contest.start_time),
      duration: contest.duration / 60,
      url: contest.url
    }));
  } catch (error) {
    console.error(`Error fetching ${platform} contests:`, error.message);
    return [];
  }
};

const syncAllContests = async () => {
  try {
    console.log('Starting contest sync...');

    const [codeforcesContests, atcoderContests, hackerrankContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchKontestsData('AtCoder', CONTEST_APIS.atcoder),
      fetchKontestsData('HackerRank', CONTEST_APIS.hackerrank)
    ]);

    const allContests = [
      ...codeforcesContests,
      ...atcoderContests,
      ...hackerrankContests
    ];

    await prisma.contest.deleteMany({});
    
    if (allContests.length > 0) {
      await prisma.contest.createMany({
        data: allContests,
        skipDuplicates: true
      });
    }

    console.log(`Synced ${allContests.length} contests`);
  } catch (error) {
    console.error('Error syncing contests:', error.message);
  }
};

module.exports = { syncAllContests };