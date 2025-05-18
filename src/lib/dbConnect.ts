// lib/dbConnect.ts
import { PrismaClient } from '@prisma/client';

const prismaClient = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient;

export const prisma = prismaClient;
