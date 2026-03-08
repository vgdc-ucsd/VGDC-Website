"use server"

import EventCard from "./EventCard"
import { EventDetails } from "@/lib/events"

/** Returns a vertical list of events. */
export default async function EventList({
  events,
}: {
  events: EventDetails[]
}) {
  return (
    <div className="space-y-6">
      {/* Display the events one by one. */}
      {events.length > 0 ? (
        events.map((event) => {
          return (
            <EventCard
              title={event.title}
              description={event.description}
              date={event.date}
              time={event.time}
              location={event.location}
              image={event.image}
              slug={event.slug}
              key={event.slug}
            />
          )
        })
      ) : (
        <h3 className="text-xl text-text-grey">
          No events found, check back again soon!
        </h3>
      )}
    </div>
  )
}
