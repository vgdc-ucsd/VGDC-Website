"use server"

import Navbar from "@/components/global/Navbar"
import EventList from "@/components/EventList"
import Footer from "@/components/global/Footer"

import { SectionHeader } from "@/components/homepage/shared/SectionComponents"

import { getEvents } from "@/lib/events"

/** Dedicated events page. */
export default async function Events() {
  // Gets the event data based on parameters passed in.
  const events = await getEvents(false, false, true, false)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      {/* Page content */}
      <div className="mx-auto my-20 max-w-[920px] px-8 pb-20 text-white">
        <SectionHeader
          heading="Explore Events"
          subheading="<- back"
          href="./"
          flip={true}
        />
        <EventList events={events} />
      </div>
      <Footer />
    </main>
  )
}
