import moment from 'moment';
import { GameStatus } from '@/lib/generated/prisma/client';

export interface TransformedGame {
  title: string;
  credits: string[];
  description: string;
  releaseDate: Date;
  difficulty: number;
  link: string | null;
  thumbnail: string | null;
  isWebPlayable: boolean;
  status: GameStatus;
  hasSeal: boolean;
  themeText: string;
}

export interface TransformedEvent {
  name: string;
  location: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  image: string | null;
  gallery: string[];
  slug: string;
}

export interface TransformedBlogPost {
  title: string;
  subtitle: string;
  date: Date;
  authors: string[];
  coverImage: string | null;
  coverCaption: string | null;
  postData: string;
}

export interface TransformedStoreItem {
  name: string;
  price: number;
  description: string;
  image: string | null;
  gallery: string[];
  stock: number;
}

export interface GameTagData {
  text: string;
  color: string;
}

/**
 * Reused from /lib/post_sheets.ts
 * Converts a title to a clean URL slug
 */
export function formatTitleToSlugClean(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove non-alphanumeric characters
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');
}

/**
 * Transform a single game row from Google Sheets
 * Column mapping:
 * [0] title, [1] releaseDate, [2] difficulty, [3] description,
 * [4] credits (comma-separated), [5] link, [6] status (boolean),
 * [7] image, [8] theme, [9] vgdcApproved, [10] web
 */
function transformGame(row: string[], index: number): TransformedGame | null {
  try {
    // Skip empty rows
    if (!row[0] || row[0] === '') return null;

    // Parse credits: split by comma and trim
    const credits = row[4]
      ? row[4]
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c !== '')
      : [];

    // Parse status: boolean to enum
    const status =
      row[6] === 'TRUE' ? GameStatus.RELEASED : GameStatus.UNRELEASED;

    // Parse date: M/D/YYYY format, fallback to 1/1/2000 if invalid
    const releaseDate = moment(row[1], 'M/D/YYYY', true);
    const validDate = releaseDate.isValid() ? releaseDate.toDate() : new Date('2000-01-01');

    return {
      title: row[0],
      credits,
      description: row[3] || '',
      releaseDate: validDate,
      difficulty: parseInt(row[2]) || 0,
      link: row[5] || null,
      thumbnail: row[7] || null,
      isWebPlayable: row[10] === 'TRUE',
      status,
      hasSeal: row[9] === 'TRUE',
      themeText: row[8] || '',
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed game at row ${index + 2}:`,
      (error as Error).message
    );
    return null;
  }
}

export function transformGames(data: string[][] | null | undefined): TransformedGame[] {
  if (!data) return [];

  return data
    .map((row, index) => transformGame(row, index))
    .filter((game): game is TransformedGame => game !== null);
}

/**
 * Transform a single event row from Google Sheets
 * Column mapping:
 * [0] title, [1] description, [2] location, [3] date (M/D/YYYY),
 * [4] startTime (h:mm A), [5] endTime (h:mm A), [6] image,
 * [7] homepage (not migrated), [9] slug
 */
function transformEvent(
  row: string[],
  index: number
): TransformedEvent | null {
  try {
    if (!row[0] || row[0] === '') return null;

    // Parse date: M/D/YYYY format, fallback to 1/1/2000 if invalid
    const dateParsed = moment(row[3], 'M/D/YYYY', true);
    const date = dateParsed.isValid() ? dateParsed.toDate() : new Date('2000-01-01');

    // Parse times: h:mm A format, fallback to midnight if invalid
    const startTimeParsed = moment(row[4], 'h:mm A', true);
    const startTime = startTimeParsed.isValid() ? startTimeParsed.toDate() : moment('12:00 AM', 'h:mm A').toDate();

    const endTimeParsed = moment(row[5], 'h:mm A', true);
    const endTime = endTimeParsed.isValid() ? endTimeParsed.toDate() : moment('11:59 PM', 'h:mm A').toDate();

    // Use provided slug or generate from title
    const slug = row[9] || formatTitleToSlugClean(row[0]);

    return {
      name: row[0],
      location: row[2] || '',
      date,
      startTime,
      endTime,
      description: row[1] || '',
      image: row[6] || null,
      gallery: [], // No gallery data in sheets
      slug,
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed event at row ${index + 2}:`,
      (error as Error).message
    );
    return null;
  }
}

export function transformEvents(data: string[][] | null | undefined): TransformedEvent[] {
  if (!data) return [];

  return data
    .map((row, index) => transformEvent(row, index))
    .filter((event): event is TransformedEvent => event !== null);
}

/**
 * Transform a single blog post row from Google Sheets
 * Column mapping:
 * [0] title, [1] date, [2] author (comma-separated), [3] excerpt,
 * [4] coverImage, [5] coverCredit, [6] content
 */
function transformBlogPost(
  row: string[],
  index: number
): TransformedBlogPost | null {
  try {
    if (!row[0] || row[0] === '') return null;

    // Parse authors: split by comma and trim
    const authors = row[2]
      ? row[2]
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a !== '')
      : [];

    // Parse date: M/D/YYYY format, fallback to 1/1/2000 if invalid
    const date = moment(row[1], 'M/D/YYYY', true);
    const validDate = date.isValid() ? date.toDate() : new Date('2000-01-01');

    return {
      title: row[0],
      subtitle: row[3] || '',
      date: validDate,
      authors,
      coverImage: row[4] || null,
      coverCaption: row[5] === '' ? null : row[5],
      postData: row[6] || '',
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed blog post at row ${index + 2}:`,
      (error as Error).message
    );
    return null;
  }
}

export function transformBlogPosts(
  data: string[][] | null | undefined
): TransformedBlogPost[] {
  if (!data) return [];

  return data
    .map((row, index) => transformBlogPost(row, index))
    .filter((post): post is TransformedBlogPost => post !== null);
}

/**
 * Transform a single store item row from Google Sheets
 * Column mapping:
 * [0] name, [1] price, [2] image1, [3] image2, [4] stock (boolean, ignored)
 */
function transformStoreItem(
  row: string[],
  index: number
): TransformedStoreItem | null {
  try {
    if (!row[0] || row[0] === '') return null;

    // Parse price: remove currency formatting
    const priceStr = row[1]?.replace(/[$,]/g, '') || '0';
    const price = parseFloat(priceStr);

    // Build gallery array from image2
    const gallery: string[] = [];
    if (row[3] && row[3] !== '') {
      gallery.push(row[3]);
    }

    return {
      name: row[0],
      price,
      description: 'Unset description', // User decision: default description
      image: row[2] || null,
      gallery,
      stock: 10, // User decision: default stock
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed store item at row ${index + 2}:`,
      (error as Error).message
    );
    return null;
  }
}

export function transformStoreItems(
  data: string[][] | null | undefined
): TransformedStoreItem[] {
  if (!data) return [];

  return data
    .map((row, index) => transformStoreItem(row, index))
    .filter((item): item is TransformedStoreItem => item !== null);
}

export function extractUniqueGameTags(games: TransformedGame[]): GameTagData[] {
  const uniqueThemes = new Set<string>();

  games.forEach((game) => {
    if (game.themeText && game.themeText.trim() !== '') {
      uniqueThemes.add(game.themeText.trim());
    }
  });

  const themes = Array.from(uniqueThemes);
  const colors = generateTagColors(themes.length);

  return themes.map((theme, index) => ({
    text: theme,
    color: colors[index],
  }));
}

function generateTagColors(count: number): string[] {
  const colorPalette = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(colorPalette[i % colorPalette.length]);
  }
  return colors;
}
