import Navbar from "@/components/global/Navbar"
import EventList from "@/components/EventList"
import Footer from "@/components/global/Footer"
import Link from "next/link"

/** Dedicated events page. */
export default function Events() {
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
          <h2 className="mb-3 mt-2 text-4xl font-bold">Explore Events</h2>
        </div>
        <EventList homepage={false} />
      </div>
      <Footer />
    </main>
  )
}
