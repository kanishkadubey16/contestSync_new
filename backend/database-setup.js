const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    console.log(`✅ Database tables ready. Users: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };