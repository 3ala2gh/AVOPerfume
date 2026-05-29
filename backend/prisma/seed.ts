import 'dotenv/config';
import process from 'node:process';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import type { Prisma } from '../src/generated/prisma/client.js';

function getEnvOrDefault(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : fallback;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing ${key} environment variable`);
  }
  return value;
}

const databaseUrl = getRequiredEnv('DATABASE_URL');

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  const saltRounds = 12;
  return bcrypt.hashSync(password, saltRounds);
}

async function main() {
  const adminName = getEnvOrDefault('ADMIN_NAME', 'Admin');
  const adminEmail = getEnvOrDefault('ADMIN_EMAIL', 'admin@avoperfume.com');
  const adminPassword = getEnvOrDefault('ADMIN_PASSWORD', 'ChangeMe123!');

  const upsertRoleArgs = (name: string): Prisma.RoleUpsertArgs => ({
    where: { name },
    update: {},
    create: { name },
  });

  const adminRole = await prisma.role.upsert(upsertRoleArgs('admin'));

  await prisma.role.upsert(upsertRoleArgs('user'));
  const defaultCategories = ['Floral', 'Woody', 'Oriental', 'Fresh'];
  await Promise.all(
    defaultCategories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashPassword(adminPassword),
      roleId: adminRole.id,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashPassword(adminPassword),
      roleId: adminRole.id,
    },
  });

  console.log(`Admin user is ready: ${adminEmail}`);
}

main()
  .catch((error: unknown) => {
    const safeError =
      error instanceof Error ? error : new Error('Unknown seed error');
    console.error(safeError);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
