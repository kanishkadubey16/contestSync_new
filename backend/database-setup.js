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
    
    // Create admin user if no users exist
    if (userCount === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@contestsync.com',
          username: 'admin',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin user created: admin@contestsync.com / admin123');
    }
    
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