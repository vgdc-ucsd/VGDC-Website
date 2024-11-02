"use server"

import Navbar from "@/components/global/Navbar"
import EventList from "@/components/events/EventList"
import Footer from "@/components/global/Footer"

import { PageComponent, PageHeader } from "@/components/global/PageComponents"

import { getEvents } from "@/lib/events"

/** Dedicated events page. */
export default async function Events() {
  // Gets the event data based on parameters passed in.
  let events = await getEvents(false, false, true, false)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      {/* Page content */}
      <PageComponent>
        <PageHeader
          heading="Explore Events"
          subheading="<- back"
          href="./"
          flip={true}
        />
        <EventList events={events} />
      </PageComponent>
      <Footer />
    </main>
  )
}
