import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/images.server';
import { getImageType, type ImageFolder } from '@/lib/images.shared';
import {
  formatTitleToSlugClean,
  type TransformedBlogPost,
  type TransformedEvent,
  type TransformedGame,
  type TransformedStoreItem,
} from './data-transformers';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CONCURRENCY = 6;
const DOWNLOAD_TIMEOUT_MS = 30_000;

export interface ImageUploadSummary {
  uploaded: number;
  kept: number;
  failed: { record: string; source: string; reason: string }[];
}

/**
 * The sheets hold images the way the old site used them as <img src>: either a
 * path in /public ("/images/games/foo.png") or a full URL. The site now reads
 * image fields as paths in the Supabase "Images" bucket, so each one is
 * uploaded there and the field is replaced with its storage path.
 *
 * Runs before the database transaction. Images that can't be uploaded are set
 * to null and reported, rather than aborting the whole import.
 */
export class ImageUploader {
  private client: SupabaseClient;
  // Same source is uploaded once even if several records use it
  private cache = new Map<string, Promise<string>>();
  private summary: ImageUploadSummary = { uploaded: 0, kept: 0, failed: [] };

  constructor() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      this.client = createClient(process.env.SUPABASE_URL!, serviceKey, {
        auth: { persistSession: false },
      });
    } else {
      console.warn(
        '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set; uploading with the anon key, which fails unless the bucket allows anonymous uploads'
      );
      this.client = supabase;
    }
  }

  async uploadAll(data: {
    games: TransformedGame[];
    events: TransformedEvent[];
    blogPosts: TransformedBlogPost[];
    storeItems: TransformedStoreItem[];
  }): Promise<ImageUploadSummary> {
    console.log('🖼️  Uploading images to Supabase storage...');

    const tasks: (() => Promise<void>)[] = [];

    for (const game of data.games) {
      const record = `game "${game.title}"`;
      tasks.push(async () => {
        game.thumbnail = await this.resolve(game.thumbnail, 'games', game.title, record);
      });
    }
    for (const event of data.events) {
      const record = `event "${event.name}"`;
      tasks.push(async () => {
        event.image = await this.resolve(event.image, 'events', event.slug, record);
      });
      tasks.push(async () => {
        event.gallery = await this.resolveList(event.gallery, 'events', event.slug, record);
      });
    }
    for (const post of data.blogPosts) {
      const record = `blog post "${post.title}"`;
      tasks.push(async () => {
        post.coverImage = await this.resolve(post.coverImage, 'blogs', post.slug, record);
      });
    }
    for (const item of data.storeItems) {
      const record = `store item "${item.name}"`;
      tasks.push(async () => {
        item.image = await this.resolve(item.image, 'store', item.name, record);
      });
      tasks.push(async () => {
        item.gallery = await this.resolveList(item.gallery, 'store', item.name, record);
      });
    }

    await runWithConcurrency(tasks, CONCURRENCY);

    const { uploaded, kept, failed } = this.summary;
    console.log(
      `✅ Uploaded ${uploaded} images, kept ${kept} existing storage paths${failed.length > 0 ? `, ${failed.length} failed` : ''}`
    );
    if (failed.length > 0) {
      console.warn('⚠️  These images could not be uploaded and were left empty:');
      for (const { record, source, reason } of failed) {
        console.warn(`   - ${record}: ${source} (${reason})`);
      }
    }
    if (uploaded === 0 && failed.length > 0) {
      // Nothing worked at all: almost certainly credentials or bucket permissions
      throw new Error('Every image upload failed. Aborting before any database changes.');
    }

    return this.summary;
  }

  private async resolveList(
    values: string[],
    folder: ImageFolder,
    name: string,
    record: string
  ): Promise<string[]> {
    const resolved = await Promise.all(
      values.map((value) => this.resolve(value, folder, name, record))
    );
    return resolved.filter((value): value is string => value !== null);
  }

  /** Returns the storage path for a sheet image value, or null if it can't be uploaded. */
  private async resolve(
    value: string | null,
    folder: ImageFolder,
    name: string,
    record: string
  ): Promise<string | null> {
    const source = value?.trim();
    if (!source) return null;

    // Already a storage path (not a URL and not a /public path)
    if (!/^https?:\/\//i.test(source) && !source.startsWith('/')) {
      this.summary.kept++;
      return source;
    }

    let upload = this.cache.get(source);
    if (!upload) {
      upload = this.upload(source, folder, name);
      this.cache.set(source, upload);
    }

    try {
      return await upload;
    } catch (error) {
      this.summary.failed.push({ record, source, reason: (error as Error).message });
      return null;
    }
  }

  private async upload(source: string, folder: ImageFolder, name: string): Promise<string> {
    const bytes = source.startsWith('/') ? await readPublicFile(source) : await downloadImage(source);

    // Same rule as the dashboard's /api/images route: the format comes from the
    // file's bytes, and only PNG, JPEG, WebP, GIF and AVIF are accepted
    const type = await getImageType(bytes);
    if (!type) throw new Error('not a PNG, JPEG, WebP, GIF or AVIF image');

    // Same folders as dashboard uploads (events/, games/, blogs/, store/). The name
    // comes from the record plus a hash of the source, so re-running the import
    // overwrites the same file instead of adding a copy.
    const hash = createHash('sha1').update(source).digest('hex').slice(0, 8);
    const storagePath = `${folder}/${formatTitleToSlugClean(name) || 'image'}-${hash}.${type.split('/')[1]}`;

    await uploadImage(storagePath, new File([bytes], storagePath, { type }), { client: this.client, upsert: true });
    this.summary.uploaded++;
    return storagePath;
  }
}

/** Reads a file from /public (a sheet value like "/images/games/foo.png"). */
async function readPublicFile(source: string): Promise<Blob> {
  const relativePath = decodeURIComponent(source.split(/[?#]/)[0]).replace(/^\/+/, '');
  const filePath = path.join(PUBLIC_DIR, relativePath);
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
    throw new Error('path is outside public/');
  }

  const buffer = await fs.readFile(filePath).catch(() => {
    throw new Error(`not found in public/${relativePath}`);
  });
  return new Blob([new Uint8Array(buffer)]);
}

/** Downloads a remote image. Its Content-Type header isn't trusted; the bytes are checked instead. */
async function downloadImage(source: string): Promise<Blob> {
  const response = await fetch(toDirectDownloadUrl(source), {
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
  }).catch((error: Error) => {
    throw new Error(`download failed: ${error.message}`);
  });
  if (!response.ok) throw new Error(`download failed: HTTP ${response.status}`);
  return response.blob();
}

/** Google Drive share links point at an HTML viewer page; use the direct download instead. */
function toDirectDownloadUrl(url: string): string {
  const driveId =
    url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1] ??
    url.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/)?.[1];
  return driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : url;
}

async function runWithConcurrency(tasks: (() => Promise<void>)[], limit: number) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (next < tasks.length) {
      await tasks[next++]();
    }
  });
  await Promise.all(workers);
}
