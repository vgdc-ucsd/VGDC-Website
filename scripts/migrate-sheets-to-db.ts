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

  // Environment check
  const isProd = process.argv.includes('--prod');
  const environment = isProd ? 'PRODUCTION' : 'DEVELOPMENT';
  console.log(`Environment: ${environment}`);

  if (isProd) {
    const confirmed = await confirmAction(
      '\n⚠️  This will DELETE all data in production and replace it. Are you sure?'
    );
    if (!confirmed) {
      console.log('Migration cancelled by user');
      process.exit(0);
    }
  }

  // Initialize Prisma
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Fetch data from Google Sheets
    console.log('\n' + '='.repeat(50));
    const rawData = await fetchAllSheetData();

    // Validate fetched data
    if (!rawData.games && !rawData.events && !rawData.blog && !rawData.store) {
      throw new Error('No data fetched from any sheet');
    }

    // Warn about missing sheets
    if (!rawData.games) console.warn('⚠️  No games data found');
    if (!rawData.events) console.warn('⚠️  No events data found');
    if (!rawData.blog) console.warn('⚠️  No blog data found');
    if (!rawData.store) console.warn('⚠️  No store data found');

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
