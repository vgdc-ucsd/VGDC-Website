import { EventDetails, getEvents, getSingleEvent } from "@/lib/events"

import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import Custom404 from "@/app/not-found"
import EventView from "./components/EventView"
import { notFound } from "next/navigation"

/** Generates static parameters for dynamic routes */
export async function generateStaticParams() {
  const result = await getEvents({
    homepage: false, 
    includeOldEvents: true, 
    includeNewEvents: true,
  });
  if (!result.ok) return [];
  const events = result.data;

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
  const slug = (await params).event;
  const result = await getSingleEvent(slug);
  if (!result.ok) notFound();
  const eventDetails = result.data;

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <EventView event={eventDetails} />
      <Footer />
    </main>
  )
}
