import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@viewlytics.com';
  const password = 'ViewlyticsAdmin2026!';
  const saltRounds = 12;

  console.log('Generating password hash...');
  const passwordHash = await bcrypt.hash(password, saltRounds);

  console.log('Upserting admin user...');
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user seeded successfully with ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
