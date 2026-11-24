#!/usr/bin/env tsx

/**
 * Copies every image from the Supabase "Images" bucket to the R2 images bucket,
 * keeping the same paths, so the paths stored in the database keep working.
 *
 * Safe to re-run: images already in R2 with the same size are skipped.
 *
 * Flags:
 *   --dry-run  List what would be copied without uploading anything
 *   --force    Re-upload images that are already in R2
 *   --yes      Skip the confirmation prompt
 */

import * as readline from 'readline';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import { IMMUTABLE_CACHE_CONTROL, uploadImage } from '@/lib/images.server';
import { getImageType } from '@/lib/images.shared';
import { s3, S3_IMAGES_BUCKET } from '@/lib/r2.server';
import { IMPORT_CACHE_CONTROL, runWithConcurrency } from './lib/image-uploader';

const SUPABASE_BUCKET = 'Images';
const LIST_PAGE_SIZE = 1000;
const CONCURRENCY = 6;

// Dashboard uploads are named <folder>/<uuid>.<ext> and never change. Anything
// else came from the sheets import, which can overwrite the same path later.
const UUID_FILENAME = /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.\w+$/;

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

type StoredImage = { path: string; size?: number; mimetype?: string };

async function main() {
  const missing = [
    ['NEXT_PUBLIC_SUPABASE_URL', supabaseUrl],
    ['SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY', supabaseKey],
    ['S3_API_ENDPOINT', process.env.S3_API_ENDPOINT],
    ['S3_ACCESS_KEY_ID', process.env.S3_ACCESS_KEY_ID],
    ['S3_SECRET_ACCESS_KEY', process.env.S3_SECRET_ACCESS_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  const supabase = createClient(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } });
  const storage = supabase.storage.from(SUPABASE_BUCKET);

  console.log(`📦 Source: ${new URL(supabaseUrl!).host} / ${SUPABASE_BUCKET}`);
  console.log(`☁️  Destination: ${new URL(process.env.S3_API_ENDPOINT!).host} / ${S3_IMAGES_BUCKET}`);

  console.log('\n🔍 Listing images in Supabase...');
  const images = await listAll(storage, '');
  console.log(`Found ${images.length} images`);
  if (images.length === 0) return;

  if (dryRun) {
    for (const image of images) console.log(`   ${image.path}`);
    console.log('\nDry run: nothing was uploaded');
    return;
  }

  const confirmed =
    process.argv.includes('--yes') ||
    (await confirm(`\nCopy ${images.length} images to R2${force ? ', overwriting existing ones' : ''}?`));
  if (!confirmed) {
    console.log('Cancelled');
    return;
  }

  let copied = 0;
  let skipped = 0;
  const failed: { path: string; reason: string }[] = [];

  await runWithConcurrency(
    images.map((image) => async () => {
      try {
        if (!force && (await existsInR2(image))) {
          skipped++;
          return;
        }

        const { data, error } = await storage.download(image.path);
        if (error) throw error;

        // Trust the bytes over the stored metadata, like the upload route does
        const contentType = (await getImageType(data)) ?? image.mimetype ?? data.type;
        const cacheControl = UUID_FILENAME.test(image.path) ? IMMUTABLE_CACHE_CONTROL : IMPORT_CACHE_CONTROL;

        await uploadImage(image.path, data, { contentType, cacheControl });
        copied++;
        if (copied % 25 === 0) console.log(`   ...copied ${copied}`);
      } catch (error) {
        failed.push({ path: image.path, reason: (error as Error).message });
      }
    }),
    CONCURRENCY
  );

  console.log(`\n✅ Copied ${copied}, skipped ${skipped} already in R2${failed.length ? `, ${failed.length} failed` : ''}`);
  if (failed.length > 0) {
    console.warn('⚠️  These images could not be copied (re-run the script to retry them):');
    for (const { path, reason } of failed) console.warn(`   - ${path}: ${reason}`);
    process.exitCode = 1;
  }
}

/** Recursively lists every file under `prefix`. Supabase returns folders as entries with a null id. */
async function listAll(
  storage: ReturnType<ReturnType<typeof createClient>['storage']['from']>,
  prefix: string
): Promise<StoredImage[]> {
  const files: StoredImage[] = [];

  for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
    const { data, error } = await storage.list(prefix, {
      limit: LIST_PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`Couldn't list "${prefix || '/'}": ${error.message}`);

    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        files.push(...(await listAll(storage, path)));
      } else if (entry.name !== '.emptyFolderPlaceholder') {
        files.push({ path, size: entry.metadata?.size, mimetype: entry.metadata?.mimetype });
      }
    }

    if (data.length < LIST_PAGE_SIZE) return files;
  }
}

/** Whether R2 already has this image. A size mismatch counts as missing, e.g. a partial earlier copy. */
async function existsInR2(image: StoredImage): Promise<boolean> {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: S3_IMAGES_BUCKET, Key: image.path }));
    return image.size === undefined || head.ContentLength === image.size;
  } catch (error) {
    if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return false;
    throw error;
  }
}

function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

main().catch((error) => {
  console.error('\n💥 Image migration failed:', (error as Error).message);
  process.exit(1);
});
