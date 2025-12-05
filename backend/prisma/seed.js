const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Delete existing admin if exists
  try {
    await prisma.user.delete({ where: { username: 'admin' } });
  } catch (error) {
    // Admin doesn't exist, continue
  }
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:', { email: admin.email, username: admin.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });