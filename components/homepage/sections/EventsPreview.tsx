"use server"

import { getEvents, GetEventsFlags } from "@/lib/events"

import { SectionComponent, SectionHeader } from "../../global/SectionComponents"
import EventList from "@/components/events/EventList"

/** Returns a vertical list of events. */
export default async function EventsPreview({
  /** Only include events for the homepage? False by default. */
  homepage = true,
  /** Include events that haven't already passed? False by default. */
  includeOldEvents = false,
  /** Include events that haven't happened yet? True by default. */
  includeNewEvents = true,
  /** Reverse order of events? False by default, helpfulf or showing past events. */
  latestFirst: reverseOrder = false,
}: GetEventsFlags) {
  // Gets the event data based on parameters passed in.
  const result = await getEvents({
    homepage,
    includeOldEvents,
    includeNewEvents,
    latestFirst: reverseOrder
  });
  // This should probably get a proper error UI
  const events = result.ok 
    ? result.data
    : [];

  return (
    <SectionComponent>
      <SectionHeader
        heading="Explore Events"
        subheading="View more events ->"
        href="/events"
      />
      <EventList events={events} />
    </SectionComponent>
  )
}
