import moment from "moment-timezone"
import { prisma } from "@/lib/prisma"
import type { Event } from "@/lib/generated/prisma/client"
import { EventWhereInput } from "@/lib/generated/prisma/models"
import { getStoredImageUrl } from "@/lib/images.server"
import { Result, Timezone } from "@/lib/dateUtils"

/** The details of an event, formatted for display. */
export type EventDetails = {
  title: string
  description: string
  location: string
  date: string
  time: string
  image: string
  slug: string
}

export interface GetEventsFlags {
  homepage?: boolean;
  includeOldEvents?: boolean;
  includeNewEvents?: boolean;
  latestFirst?: boolean;
}

/**
 * Formats an event for display. Timestamps are stored as exact instants, so
 * they're converted to Pacific time here rather than relying on the server's
 * time zone (UTC on Vercel).
 */
async function toEventDetails(event: Event): Promise<EventDetails> {
  const start = moment(event.startTimestamp).tz(Timezone);
  const end = moment(event.endTimestamp).tz(Timezone);

  return {
    title: event.name,
    description: event.description,
    location: event.location,
    date: start.format("MMMM Do"),
    time: `${start.format("LT")} - ${end.format("LT")}`,
    image: event.image ? await getStoredImageUrl(event.image) : "",
    slug: event.slug,
  };
}

/**
 * Gets a single event from the database
 */
export async function getSingleEvent(slug: string): Promise<Result<EventDetails>> {
  const event = await prisma.event.findUnique({
    where: { slug: slug }
  })

  if (!event) return { ok: false, error: `Failed to get event ${slug}` }

  return { ok: true, data: await toEventDetails(event) };
}

/**
 * Gets the events from the database, filters them, and sorts them.
 * @param homepage Only include events for the homepage? False by default.
 * @param includeOldEvents Include events that have already ended? False by default.
 * @param includeNewEvents Include events that haven't ended yet (upcoming or happening now)? True by default.
 * @param latestFirst Order events with the latest first? False by default, helpful for showing past events.
 * @returns The list of events, sorted and filtered.
 */
export async function getEvents({
  homepage = false,
  includeOldEvents = false,
  includeNewEvents = true,
  latestFirst = false
}: GetEventsFlags): Promise<Result<EventDetails[]>> {
  // An event is "old" once it has ended, and "new" until then (including while it's
  // happening). Both checks use endTimestamp, so every event is in exactly one group.
  const now = new Date();

  // Exclude time ranges based on parameters
  const timeExcludes: EventWhereInput[] = [];
  if (!includeOldEvents) timeExcludes.push({ endTimestamp: { lt: now } });
  if (!includeNewEvents) timeExcludes.push({ endTimestamp: { gte: now } });

  try {
    const events = await prisma.event.findMany({
      where: timeExcludes.length > 0 ? { NOT: { OR: timeExcludes } } : undefined,
      orderBy: { startTimestamp: latestFirst ? "desc" : "asc" },
    });

    return {
      ok: true,
      data: await Promise.all(events.map(toEventDetails))
    };
  } catch (error) {
    console.log(error)
    return { ok: false, error: "Internal server error"}
  }
}
