import moment from "moment"
import { prisma } from "./prisma"
import { EventWhereInput } from "./generated/prisma/models"
import { GetStoredImageUrl } from "./images"
import { supabase } from "./supabase"

/** The details of an event from the spreadsheet. */
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
 * Gets the events from a spreadsheet, filters them, and sorts them.
 * @param homepage Only include events for the homepage? False by default.
 * @param includeOldEvents Include events that have already passed? False by default.
 * @param includeNewEvents Include events that haven't happened yet? True by default.
 * @param latestFirst Order events with the latest first? False by default, helpful for showing past events.
 * @returns The list of events, sorted and filtered.
 */
export async function getEvents({
  homepage = false,
  includeOldEvents = false,
  includeNewEvents = true,
  latestFirst = false
}: GetEventsFlags) {
  //
  // Gets the current moment to filter out events after this time.
  const today = moment().startOf("day").toDate();
  // Gets the current moment to filter out events before this time. Subtracts 1 day so events show a day after ending.
  const yesterday = moment().subtract(1, "day").startOf("day").toDate();

  // Exclude date ranges based on parameters
  const dateExcludes: EventWhereInput[] = [];
  if (!includeOldEvents) dateExcludes.push({ date: { lte: yesterday } });
  if (!includeNewEvents) dateExcludes.push({ date: { gt: today } });

  try {
    const events = await prisma.event.findMany({
      where: dateExcludes.length > 0 ? { NOT: { OR: dateExcludes } } : undefined,
      orderBy: [
        { date: latestFirst ? "asc" : "desc" },
        { startTime: latestFirst ? "asc" : "desc" },
      ]
    });

    const eventsDetailsPromises = events.map(async (event) => {
      const eventImage = event.image 
        ? await GetStoredImageUrl(event.image)
        : "";

      return {
        title: event.name,
        description: event.description,
        location: event.location,
        date: moment(event.date).format("MMMM Do"),
        time: moment(event.startTime).utc().format("LT") 
          + " - " 
          + moment(event.endTime).utc().format("LT"),
        image: eventImage,
        slug: event.slug,
      } satisfies EventDetails;
    });
    return await Promise.all(eventsDetailsPromises);
  } catch (e) {
    return [];
  }
}
