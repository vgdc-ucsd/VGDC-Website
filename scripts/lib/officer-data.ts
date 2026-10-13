import fs from 'fs/promises';
import path from 'path';
import { Role } from '@/lib/generated/prisma/client';
import { formatTitleToSlugClean } from './data-transformers';

const OFFICERS_FILE = path.join(process.cwd(), 'public', 'data', 'officers.json');

// officers.json keys the active year as "current" instead of by its school year
export const CURRENT_YEAR = '2026-2027';

// Mascot images used when an officer had no photo. The site already shows a
// random mascot for bios without an image, so these are imported as empty.
const PLACEHOLDER_IMAGE_DIR = '/images/officers/placeholders/';

// Prefix for the stand-in discordHandle of imported users, which officers.json
// doesn't have. Replace these with real handles once officers are linked to Discord.
export const PLACEHOLDER_HANDLE_PREFIX = 'import:';

interface RawOfficer {
  title: string;
  name: string;
  avatar: string;
  quote: string;
}

interface RawOfficerYear {
  heading: string;
  paragraph: string;
  link: string;
  officers: RawOfficer[];
}

export interface TransformedOfficerUser {
  name: string;
  discordHandle: string;
  role: Role;
  profilePicture: string | null;
}

export interface TransformedOfficerBio {
  /** discordHandle of the user this bio belongs to */
  userHandle: string;
  position: string;
  description: string;
  image: string | null;
}

export interface TransformedOfficerYear {
  year: string;
  excerpt: string;
  startTimestamp: Date;
  /** In display order (the order of officers.json) */
  bios: TransformedOfficerBio[];
}

export interface TransformedOfficers {
  currentYear: string;
  /** Newest year first */
  years: TransformedOfficerYear[];
  users: TransformedOfficerUser[];
}

export async function readOfficerData(): Promise<Record<string, RawOfficerYear>> {
  console.log('📡 Reading officer data from public/data/officers.json...');
  const data = JSON.parse(await fs.readFile(OFFICERS_FILE, 'utf-8')) as Record<string, RawOfficerYear>;

  for (const [year, { officers }] of Object.entries(data)) {
    console.log(`  ${year}: ${officers?.length ?? 0} officers`);
  }
  return data;
}

/** The same person appears once per year they were an officer, so they're keyed by name. */
function placeholderHandle(name: string): string {
  return PLACEHOLDER_HANDLE_PREFIX + formatTitleToSlugClean(name).toLowerCase();
}

/** "2024-2025" -> September 1, 2024, when the fall quarter's officer team takes over. */
function schoolYearStart(year: string): Date {
  const match = year.match(/^(\d{4})-(\d{4})$/);
  if (!match || Number(match[2]) !== Number(match[1]) + 1) {
    throw new Error(`officers.json: "${year}" is not a school year like "2024-2025"`);
  }
  return new Date(Date.UTC(Number(match[1]), 8, 1));
}

function toImage(avatar: string | undefined): string | null {
  const source = avatar?.trim();
  if (!source || source.startsWith(PLACEHOLDER_IMAGE_DIR)) return null;
  return source;
}

export function transformOfficers(data: Record<string, RawOfficerYear>): TransformedOfficers {
  const years = Object.entries(data)
    .map(([key, raw]) => {
      const year = key === 'current' ? CURRENT_YEAR : key;
      return {
        year,
        excerpt: raw.paragraph,
        startTimestamp: schoolYearStart(year),
        bios: (raw.officers ?? []).map((officer) => ({
          userHandle: placeholderHandle(officer.name),
          position: officer.title.trim(),
          description: officer.quote.trim(),
          image: toImage(officer.avatar),
        })),
        names: (raw.officers ?? []).map((officer) => officer.name.trim()),
      };
    })
    .sort((a, b) => b.startTimestamp.getTime() - a.startTimestamp.getTime());

  const duplicateYears = years.filter((y, i) => years.findIndex((other) => other.year === y.year) !== i);
  if (duplicateYears.length > 0) {
    throw new Error(`officers.json has ${duplicateYears[0].year} more than once (is "current" also listed by year?)`);
  }

  // Years are newest first, so a person's profile picture is the photo from the
  // latest year they had one
  const users = new Map<string, TransformedOfficerUser>();
  for (const { year, bios, names } of years) {
    bios.forEach((bio, i) => {
      const existing = users.get(bio.userHandle);
      if (existing) {
        existing.profilePicture ??= bio.image;
        return;
      }
      users.set(bio.userHandle, {
        name: names[i],
        discordHandle: bio.userHandle,
        role: year === CURRENT_YEAR ? Role.OFFICER : Role.MEMBER,
        profilePicture: bio.image,
      });
    });
  }

  return {
    currentYear: CURRENT_YEAR,
    years: years.map(({ names: _, ...year }) => year),
    users: Array.from(users.values()),
  };
}
