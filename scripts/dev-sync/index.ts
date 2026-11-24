#!/usr/bin/env tsx

/**
 * Local development services and prod-to-local sync. Never runs automatically.
 *
 *   pnpm dev:services        start local Postgres and Garage
 *   pnpm db:pull             copy the prod database and images to them
 *   pnpm db:pull --db        only the database
 *   pnpm db:pull --images    only the images
 *   pnpm db:reset:local      wipe both and start with an empty, migrated database
 *
 * Flags:
 *   --services  Only start the services, don't copy anything
 *   --reset     Delete the local services' data, restart them and run migrations
 *   --yes       Don't ask before replacing a local database that has tables
 *   --force     Re-copy images that are already local
 *
 * Reads from SYNC_REMOTE_DB_URL and SYNC_R2_* (read-only credentials, pulled from
 * Vercel's Development environment) and writes to POSTGRES_* and S3_*, which
 * come from .env.services and must point at this machine.
 */

import { execSync } from 'child_process';
import { pullDatabase } from './db';
import { compose } from './docker';
import { assertComposeDatabase, assertLocal, assertRemote, requireEnv } from './guards';
import { pullImages } from './images';
import { startServices } from './services';

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);

async function main() {
  if (has('--services')) {
    startServices();
    return;
  }

  if (has('--reset')) {
    // Migrations run through the env URLs, so make sure they're the local database first
    assertLocal('POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING');
    assertComposeDatabase('POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING');
    console.log('🧹 Deleting local Postgres and Garage data...');
    compose(['down', '--volumes'], { label: 'Removing the containers and their data' });
    startServices();
    execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit' });
    return;
  }

  // Neither flag means both
  const syncDb = has('--db') || !has('--images');
  const syncImages = has('--images') || !has('--db');

  // Check everything before touching anything
  if (syncDb) {
    assertLocal('POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING');
    assertComposeDatabase('POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING');
    assertRemote('SYNC_REMOTE_DB_URL');
  }
  if (syncImages) {
    assertLocal('S3_API_ENDPOINT');
    requireEnv('S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'SYNC_R2_ACCESS_KEY_ID', 'SYNC_R2_SECRET_ACCESS_KEY');
    assertRemote('SYNC_R2_ENDPOINT');
  }

  startServices();

  if (syncDb && !(await pullDatabase({ yes: has('--yes') }))) return;
  if (syncImages) await pullImages({ force: has('--force') });
}

main().catch((error) => {
  console.error('\n💥 Sync failed:', (error as Error).message);
  process.exit(1);
});
