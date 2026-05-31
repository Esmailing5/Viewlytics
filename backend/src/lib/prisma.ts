import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false },
  family: 4
} as any);
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
