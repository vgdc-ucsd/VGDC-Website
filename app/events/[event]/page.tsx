import { EventDetails, getEvents } from "@/lib/events"

import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import Custom404 from "@/app/not-found"
import EventView from "./components/EventView"

/** Generates static parameters for dynamic routes */
export async function generateStaticParams() {
  let events = await getEvents({
    homepage: false, 
    includeOldEvents: true, 
    includeNewEvents: true,
  });

  return events.map((event) => ({
    event: event.slug,
  }))
}

export const revalidate = 60

/** The page for a single event. */
export default async function Event({
  params,
}: {
  params: Promise<{ event: string }>
}) {
  // Get the event data, including old events.
  let events = await getEvents({
    homepage: false, 
    includeOldEvents: true, 
    includeNewEvents: true,
  });

  const slug = (await params).event

  // The details of the event.
  let eventDetails: EventDetails = {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: "",
    slug: "",
  }

  // Find the corresponding event.
  events.forEach((e) => {
    if (e.slug == slug) eventDetails = e
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
