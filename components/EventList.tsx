"use server"

import Link from "next/link"

import { getEvents } from "@/lib/events"

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

  return (
    <div
      className={`mx-auto mb-16 mt-24 w-full px-4 sm:w-[600px] sm:px-8 md:w-[680px] lg:w-[800px] ${homepage && "mb-32 mt-32"}`}
    >
      <div className="mb-6 text-left">
        {/* If the events list isn't on the homepage, include back button. */}
        {homepage || (
          <Link
            href="/"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back to home`}</Link>
        )}
        <h2 className="my-2 text-xl font-bold text-white lg:text-3xl">
          Explore Events
        </h2>
        {/* If the events list is on the homepage, include link to events page. */}
        {homepage && (
          <Link
            href="/events"
            className="text-text-grey transition-all hover:text-white"
          >{`View more events ->`}</Link>
        )}
      </div>
      <div className="space-y-6">
        {/* Display the events one by one. */}
        {events.map((event) => {
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
            />
          )
        })}
      </div>
    </div>
  )
}

/** An event card to be shown in the events list. */
function Event({ title, location, date, time, description, image, slug }: any) {
  return (
    <div className="flex rounded-3xl bg-footer-grey p-3 align-middle sm:space-x-6 sm:p-6">
      <img
        src={`${image}`}
        className="hidden w-40 rounded-xl sm:block md:w-48"
      />
      <div className="relative w-full">
        <div className="mb-2 md:mt-2">
          <Link href={`./events/${slug}`}>
            <h3 className="text-xl font-semibold text-text-white">{title}</h3>
          </Link>
          <h4 className="text-md font-semibold text-vgdc-light-green">
            {location}
          </h4>
          <h4 className="text-md font-semibold text-vgdc-light-green lg:hidden">
            {date} @ {time}
          </h4>
        </div>
        <p className="hidden w-full text-sm text-text-grey sm:block md:hidden">
          {truncate(description, 120, true)}
        </p>
        <p className="w-full text-sm text-text-grey sm:hidden md:block md:w-80 lg:w-96 lg:leading-6">
          {truncate(description, 200, true)}
        </p>
        <h4 className="invisible absolute right-2 text-right font-semibold text-text-grey lg:visible lg:top-2">
          {date}
          <br />
          {time}
        </h4>
        <Link href={`./events/${slug}`}>
          <button className="bottom-0 right-0 mt-4 h-10 w-28 rounded-lg bg-background-grey text-sm text-text-white transition-colors sm:absolute sm:right-auto md:bottom-2">
            Event Details
          </button>
        </Link>
      </div>
    </div>
  )
}

/** Returns a shortened version of a given string. */
function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str
  }
  const subString = str.slice(0, n - 1) // the original check
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "..."
  )
}
