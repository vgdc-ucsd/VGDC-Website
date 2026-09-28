#!/usr/bin/env tsx

import { PrismaClient } from '@/lib/generated/prisma/client';
import { fetchAllSheetData } from './lib/data-fetchers';
import {
  transformGames,
  transformEvents,
  transformBlogPosts,
  transformStoreItems,
  extractUniqueGameTags,
} from './lib/data-transformers';
import { DatabaseMigrator } from './lib/database-operations';
import { ImageUploader } from './lib/image-uploader';
import * as readline from 'readline';

async function confirmAction(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer: string) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

/** Host of the database the script will write to, without credentials. */
function databaseHost(): string {
  try {
    return new URL(process.env.POSTGRES_PRISMA_URL ?? '').host || 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Returns the values that appear more than once. */
function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Array.from(duplicates);
}

async function validateMigration(prisma: PrismaClient): Promise<void> {
  console.log('\n🔍 Validating migration...');

  const counts = {
    games: await prisma.game.count(),
    events: await prisma.event.count(),
    blogPosts: await prisma.blogPost.count(),
    storeItems: await prisma.storeItem.count(),
    gameTags: await prisma.gameTags.count(),
  };

  console.log('Record counts:');
  console.log(`  - Games: ${counts.games}`);
  console.log(`  - Events: ${counts.events}`);
  console.log(`  - Blog Posts: ${counts.blogPosts}`);
  console.log(`  - Store Items: ${counts.storeItems}`);
  console.log(`  - Game Tags: ${counts.gameTags}`);

  // Sample a few records to verify data integrity
  const sampleGame = await prisma.game.findFirst({
    include: { gameTags: true },
  });
  if (sampleGame) {
    console.log('\nSample game:', {
      title: sampleGame.title,
      tags: sampleGame.gameTags.map((t) => t.text),
    });
  }
}

async function main() {
  const startTime = Date.now();

  console.log('🚀 Starting Google Sheets to Prisma migration\n');

  // Which database is used is decided by the env file dotenv loads, not by a flag
  console.log(`Target database: ${databaseHost()}`);

  // Initialize Prisma
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Fetch data from Google Sheets
    console.log('\n' + '='.repeat(50));
    const rawData = await fetchAllSheetData();

    // Every table is cleared before inserting, so a sheet that failed to load
    // would wipe that table. Abort instead.
    const missingSheets = Object.entries(rawData)
      .filter(([, rows]) => !rows || rows.length === 0)
      .map(([sheet]) => sheet);
    if (missingSheets.length > 0) {
      throw new Error(
        `No data fetched for: ${missingSheets.join(', ')}. Aborting before any changes.`
      );
    }

    // Transform data
    console.log('\n' + '='.repeat(50));
    console.log('🔄 Transforming data...');
    const games = transformGames(rawData.games);
    const events = transformEvents(rawData.events);
    const blogPosts = transformBlogPosts(rawData.blog);
    const storeItems = transformStoreItems(rawData.store);
    const gameTags = extractUniqueGameTags(games);

    console.log(
      `  - Transformed ${games.length} games, ${events.length} events, ${blogPosts.length} posts, ${storeItems.length} items`
    );
    console.log(`  - Extracted ${gameTags.length} unique game tags`);

    // Slugs are unique in the database; catch collisions before changing anything
    const duplicateSlugs = [
      ...findDuplicates(events.map((e) => e.slug)).map((slug) => `event "${slug}"`),
      ...findDuplicates(blogPosts.map((p) => p.slug)).map((slug) => `blog post "${slug}"`),
    ];
    if (duplicateSlugs.length > 0) {
      throw new Error(
        `Duplicate slugs: ${duplicateSlugs.join(', ')}. Fix them in the sheet and re-run.`
      );
    }

    const confirmed =
      process.argv.includes('--yes') ||
      (await confirmAction(
        `\n⚠️  This will DELETE all games, events, blog posts and store items on ${databaseHost()} and replace them. Continue?`
      ));
    if (!confirmed) {
      console.log('Migration cancelled by user');
      return;
    }

    // Upload images first: replaces sheet URLs/public paths with storage paths.
    // Kept outside the database transaction, which would time out on downloads.
    console.log('\n' + '='.repeat(50));
    await new ImageUploader().uploadAll({ games, events, blogPosts, storeItems });

    // Run migration
    console.log('\n' + '='.repeat(50));
    const migrator = new DatabaseMigrator(prisma);
    await migrator.migrate({
      games,
      events,
      blogPosts,
      storeItems,
      gameTags,
    });

    // Validate results
    await validateMigration(prisma);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Migration completed successfully in ${duration}s`);
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('\n💥 Migration failed:', (error as Error).message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
