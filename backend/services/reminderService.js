const { PrismaClient } = require('@prisma/client');
const { sendReminderEmail } = require('./emailService');

const prisma = new PrismaClient();

const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Find contests starting in the next hour that have reminders
    const upcomingContests = await prisma.contest.findMany({
      where: {
        startTime: {
          gte: now,
          lte: oneHourFromNow
        }
      },
      include: {
        reminders: {
          include: {
            user: {
              select: { email: true, username: true }
            }
          }
        }
      }
    });

    for (const contest of upcomingContests) {
      for (const reminder of contest.reminders) {
        await sendReminderEmail(
          reminder.user.email,
          contest.name,
          contest.url,
          contest.startTime
        );
      }
    }

    if (upcomingContests.length > 0) {
      console.log(`🔔 Processed reminders for ${upcomingContests.length} contests`);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

module.exports = { checkAndSendReminders };