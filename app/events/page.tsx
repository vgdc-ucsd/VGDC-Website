import Navbar from "@/components/Navbar"
import EventList from "@/components/EventList"
import Footer from "@/components/Footer"

/** Dedicated events page. */
export default function Events() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <EventList homepage={false} />
      <Footer />
    </main>
  )
}
