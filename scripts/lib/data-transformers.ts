import moment from 'moment-timezone';
import { Timezone } from '@/lib/dateUtils';
import { GameStatus } from '@/lib/generated/prisma/client';

export interface TransformedGame {
  title: string;
  credits: string;
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
  startTimestamp: Date;
  endTimestamp: Date;
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
  slug: string;
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

// Sheet data starts at row 2 (row 4 for Events); used to report real row numbers
const FIRST_ROW = { default: 2, events: 4 };

// Games and Events use M/D/YYYY; Blog uses YYYY-M-D, sometimes with only a
// month (YYYY-M), which is treated as the 1st of that month.
// Leading zeros are optional in both.
const US_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const ISO_DATE = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/;

type DateParts = { year: number; month: number; day: number };

/** Parses a sheet date into its parts, or null if it isn't a real date. */
function parseSheetDateParts(value: string | undefined): DateParts | null {
  const text = (value ?? '').trim();

  let year, month, day;
  let match;
  if ((match = US_DATE.exec(text))) {
    [, month, day, year] = match;
  } else if ((match = ISO_DATE.exec(text))) {
    [, year, month, day = '1'] = match;
  }
  if (!year || !month || !day) return null;

  // moment months are 0-based; isValid() rejects dates like 2/30
  const parts = { year: +year, month: +month, day: +day };
  const valid = moment.utc({ year: parts.year, month: parts.month - 1, date: parts.day }).isValid();
  return valid ? parts : null;
}

const FALLBACK_DATE: DateParts = { year: 2000, month: 1, day: 1 };

/**
 * Parses a sheet date as UTC midnight, so the @db.Date columns (Game.releaseDate,
 * BlogPost.date) get the same calendar date regardless of the script's time zone.
 */
function parseSheetDate(value: string | undefined, label: string): Date {
  const parts = parseSheetDateParts(value);
  if (!parts) console.warn(`⚠️  ${label}: invalid date "${(value ?? '').trim()}", using 1/1/2000`);
  const { year, month, day } = parts ?? FALLBACK_DATE;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Parses a h:mm A sheet time into hours and minutes, falling back if it's invalid. */
function parseSheetTime(value: string | undefined, fallback: string, label: string) {
  let parsed = moment.utc((value ?? '').trim(), 'h:mm A', true);
  if (!parsed.isValid()) {
    console.warn(`⚠️  ${label}: invalid time "${value ?? ''}", using ${fallback}`);
    parsed = moment.utc(fallback, 'h:mm A', true);
  }
  return { hour: parsed.hours(), minute: parsed.minutes() };
}

/**
 * Combines an event's sheet date and times into exact timestamps. The sheet's
 * times are Pacific wall-clock times, matching what the dashboard's createEvent
 * does: an end time earlier than the start time means the event ends the next day.
 */
function parseEventTimestamps(
  dateValue: string | undefined,
  startValue: string | undefined,
  endValue: string | undefined,
  label: string
): { startTimestamp: Date; endTimestamp: Date } {
  const dateParts = parseSheetDateParts(dateValue);
  if (!dateParts) console.warn(`⚠️  ${label}: invalid date "${(dateValue ?? '').trim()}", using 1/1/2000`);
  const { year, month, day } = dateParts ?? FALLBACK_DATE;

  const at = ({ hour, minute }: { hour: number; minute: number }) =>
    moment.tz({ year, month: month - 1, date: day, hour, minute }, Timezone);

  const start = at(parseSheetTime(startValue, '12:00 AM', label));
  const end = at(parseSheetTime(endValue, '11:59 PM', label));
  if (end.isBefore(start)) end.add(1, 'day');

  return { startTimestamp: start.toDate(), endTimestamp: end.toDate() };
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

    // Parse status: boolean to enum
    const status =
      row[6] === 'TRUE' ? GameStatus.RELEASED : GameStatus.UNRELEASED;

    const label = `Game "${row[0]}" (row ${index + FIRST_ROW.default})`;

    return {
      title: row[0],
      credits: row[4]?.trim() || '',
      description: row[3] || '',
      releaseDate: parseSheetDate(row[1], label),
      difficulty: parseInt(row[2]) || 0,
      link: row[5] || null,
      thumbnail: row[7] || null,
      isWebPlayable: row[10] === 'TRUE',
      status,
      hasSeal: row[9] === 'TRUE',
      // Trimmed to match the tag text in extractUniqueGameTags, which is now unique
      themeText: row[8]?.trim() || '',
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed game at row ${index + FIRST_ROW.default}:`,
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

    const label = `Event "${row[0]}" (row ${index + FIRST_ROW.events})`;
    const { startTimestamp, endTimestamp } = parseEventTimestamps(row[3], row[4], row[5], label);

    // Use provided slug or generate from title
    const slug = row[9] || formatTitleToSlugClean(row[0]);

    return {
      name: row[0],
      location: row[2] || '',
      startTimestamp,
      endTimestamp,
      description: row[1] || '',
      image: row[6] || null,
      gallery: [], // No gallery data in sheets
      slug,
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed event at row ${index + FIRST_ROW.events}:`,
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

    const label = `Blog post "${row[0]}" (row ${index + FIRST_ROW.default})`;

    return {
      title: row[0],
      subtitle: row[3] || '',
      date: parseSheetDate(row[1], label),
      authors,
      coverImage: row[4] || null,
      coverCaption: row[5] || null,
      postData: row[6] || '',
      // Same slug the Sheets-backed /news/[id] pages use, so existing links keep working
      slug: formatTitleToSlugClean(row[0]),
    };
  } catch (error) {
    console.warn(
      `⚠️  Skipping malformed blog post at row ${index + FIRST_ROW.default}:`,
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
    if (Number.isNaN(price)) {
      throw new Error(`invalid price "${row[1]}"`);
    }

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
      `⚠️  Skipping malformed store item at row ${index + FIRST_ROW.default}:`,
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
