"use server"
import { EventDetails, getEvents } from "@/lib/events"

import Navbar from "@/components/Navbar"
import Custom404 from "@/app/not-found"

export default async function event({ params }: { params: { event: string } }) {
  let events = await getEvents(false)

  let eventDetails: EventDetails = {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: "",
    slug: "",
  }

  events.forEach((e) => {
    if (e.slug == params.event) eventDetails = e
  })

  if (eventDetails.slug != "") {
    return (
      <main className="min-h-screen bg-background-black">
        <Navbar />
        <h1 className="text-white">{eventDetails.title}</h1>
        <h3 className="text-white">{eventDetails.description}</h3>
      </main>
    )
  } else {
    return <Custom404 />
  }
}
