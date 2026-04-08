// lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Allow 'prisma' to be stored in Node.js 'globalThis'
  var prisma: PrismaClient | undefined;
}

// In development, we use 'globalThis' so that
// hot-reload doesn't create new connections every time.
// In production, a new instance is always created.
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
