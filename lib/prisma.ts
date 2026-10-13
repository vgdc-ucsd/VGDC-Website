import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "./generated/prisma/client";

/**
 * Creates a Prisma client that connects through the `pg` driver adapter.
 * Scripts use this directly; the app uses the shared `prisma` instance below.
 */
export function createPrismaClient(options: Omit<Prisma.PrismaClientOptions, "adapter"> = {}) {
  const connectionString = process.env.POSTGRES_PRISMA_URL;
  if (!connectionString) throw new Error("POSTGRES_PRISMA_URL is not set");

  // node-postgres treats sslmode=require as verify-full, which rejects Supabase's
  // certificate (it's signed by Supabase's own CA). libpq compatibility gives it the
  // standard Postgres meaning instead: encrypted, without verifying the certificate.
  const url = new URL(connectionString);
  url.searchParams.set("uselibpqcompat", "true");

  return new PrismaClient({
    ...options,
    adapter: new PrismaPg({ connectionString: url.toString() }),
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ??
  createPrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
