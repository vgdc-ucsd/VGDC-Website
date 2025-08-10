import Navbar from "@/components/global/Navbar"
import EventList from "@/components/events/EventList"
import Footer from "@/components/global/Footer"

import PageSection from "@/components/global/PageSection"

import { getEvents } from "@/lib/events"

export const revalidate = 60;

/** Dedicated events page. */
export default async function Events() {
  // Gets the event data based on parameters passed in.
  let events = await getEvents(false, true, true, false)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      {/* Page content */}
      <PageSection 
        heading="Explore Events"
      >
        <EventList events={events} />
      </PageSection>
      <Footer />
    </main>
  )
}
