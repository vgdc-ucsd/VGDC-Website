"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { EventDetails } from "@/lib/events"

export default function EventView({ event }: { event: EventDetails }) {
  // Get the search parameters
  const searchParams = useSearchParams()
  console.log(searchParams.get("from"))

  return (
    <section className="mx-auto mt-24 max-w-[920px]">
      <div className="flex flex-col lg:flex-row">
        <div className="m-4 flex-[2]">
          {searchParams.get("from") == "events" ? (
            <Link
              href="/events"
              className="text-text-grey transition-all hover:text-white"
            >{`<- back`}</Link>
          ) : (
            <Link
              href="/#events"
              className="text-text-grey transition-all hover:text-white"
            >{`<- back`}</Link>
          )}
          <h2 className="mt-2 font-inter text-4xl font-bold tracking-tight text-text-white">
            {event.title}
          </h2>
          <h4 className="mt-2 text-xl font-semibold text-hot-pink">
            {event.location}
          </h4>
          <h4 className="text-xl font-semibold text-vgdc-light-green">
            {event.date}
          </h4>
          <h4 className="text-xl font-semibold text-vgdc-light-green">
            {event.time}
          </h4>
          <p className="mt-2 whitespace-pre-line text-lg text-text-white">
            {event.description}
          </p>
          {/* <button className="mt-4 h-10 rounded-xl bg-background-grey px-3 text-lg text-text-white transition-colors">
            Schedule
          </button> */}
        </div>
        <div className="m-4 flex-1">
          <img src={`${event.image}`} className="rounded-xl" />
        </div>
      </div>
    </section>
  )
}
