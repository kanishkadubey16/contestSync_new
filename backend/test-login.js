const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Check if admin user exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', { email: admin.email, username: admin.username });
    
    // Test password
    const isValidPassword = await bcrypt.compare('admin123', admin.password);
    console.log('🔐 Password test:', isValidPassword ? '✅ Valid' : '❌ Invalid');
    
    // List all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true }
    });
    console.log('👥 All users:', users);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();