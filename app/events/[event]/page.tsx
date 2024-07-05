"use server"

import { EventDetails, getEvents } from "@/lib/events"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Custom404 from "@/app/not-found"
import EventView from "./components/EventView"

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
