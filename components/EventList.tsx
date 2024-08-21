"use server"

import Link from "next/link"

import { getEvents } from "@/lib/events"

import Event from "./EventCard"

/** Returns a vertical list of events. */
export default async function EventList({
  /** Only include events for the homepage? False by default. */
  homepage = true,
  /** Include events that haven't already passed? False by default. */
  includeOldEvents = false,
  /** Include events that haven't happened yet? True by default. */
  includeNewEvents = true,
  /** Reverse order of events? False by default, helpfulf or showing past events. */
  reverseOrder = false,
}) {
  // Gets the event data based on parameters passed in.
  const events = await getEvents(
    homepage,
    includeOldEvents,
    includeNewEvents,
    reverseOrder
  )

  // mx-auto mt-[4rem] w-fit justify-center px-8 md:mt-[8rem] xl:w-[56rem]

  return (
    <div
      id="events"
      className={`mx-auto mb-36 ${homepage && "mt-36"} w-full px-8 sm:w-[600px] sm:px-8 md:w-[44rem] lg:w-[56rem]`}
    >
      <div className="mb-6 text-left">
        {/* If the events list isn't on the homepage, include back button. */}
        {homepage && (
          <>
            <h2 className="my-2 text-xl font-bold text-white lg:text-3xl">
              Explore Events
            </h2>
            {/* Include link to events page. */}
            <Link
              href="/events"
              className="text-text-grey transition-all hover:text-white"
            >{`View more events ->`}</Link>
          </>
        )}
      </div>
      <div className="space-y-6">
        {/* Display the events one by one. */}
        {events.length > 0 ? (
          events.map((event) => {
            return (
              <Event
                title={event.title}
                description={event.description}
                date={event.date}
                time={event.time}
                location={event.location}
                image={event.image}
                slug={event.slug}
                key={event.slug}
                homepage={homepage}
              />
            )
          })
        ) : (
          <h3 className="text-xl text-text-grey">
            No events found, check back again soon!
          </h3>
        )}
      </div>
    </div>
  )
}
