"use server"

import { EventDetails, getEvents } from "@/lib/events"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Custom404 from "@/app/not-found"
import EventView from "./components/EventView"

import Link from "next/link"

/** The page for a single event. */
export default async function Event({ params }: { params: { event: string } }) {
  // Get the event data, including old events.
  let events = await getEvents(false, true, true)

  // The details of the event.
  let eventDetails: EventDetails = {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    timestamp: "",
    image: "",
    slug: "",
  }

  // Find the corresponding event.
  events.forEach((e) => {
    if (e.slug == params.event) eventDetails = e
  })

  // If an event was found, return the event page.
  if (eventDetails.slug != "") {
    return (
      <main className="min-h-screen bg-background-black">
        <Navbar />

        {/* Page content */}
        <div className="mx-auto max-w-[920px] pb-20 text-white">
          {/* Title section */}
          <div className="mx-8 mb-20 mt-20">
            <Link
              href="./"
              className="text-text-grey transition-all hover:text-white"
            >{`<- back`}</Link>
            <h2 className="mb-3 mt-2 text-4xl font-bold">Our Team</h2>
            <p className="max-w-[600px] text-lg leading-6">
              {`We're a growing body of talented individuals with a passion for
            making game development exciting in every way. Hover over each
            profile!`}
            </p>
          </div>
        </div>
        <EventView event={eventDetails} />
        <Footer />
      </main>
    )
  }
  // Otherwise, return a 404.
  else {
    return <Custom404 />
  }
}
