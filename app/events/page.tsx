import Navbar from "@/components/global/Navbar"
import EventList from "@/components/events/EventList"
import Footer from "@/components/global/Footer"

import PageSection from "@/components/global/PageSection"

import { getEvents } from "@/lib/events"

const maxNumOfRecentEvents = 5;

/** Dedicated events page. */
export default async function Events() {
  const upcomingEvents = await getEvents({
    homepage: false,
    includeOldEvents: false,
    includeNewEvents: true,
    reverseOrder: false,
  });
  const allRecentEvents = await getEvents({
    homepage: false,
    includeOldEvents: true,
    includeNewEvents: false,
    reverseOrder: true,
  });
  const recentEvents = allRecentEvents.slice(0, maxNumOfRecentEvents);

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      {/* Page content */}
      <PageSection
        heading="Explore Events"
      >
        <div className="space-y-12">
          {/* Upcoming Events Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <EventList events={upcomingEvents} />
            ) : (
              <p className="text-xl text-text-grey">No upcoming events, check back again soon!</p>
            )}
          </div>

          {/* Recent Events Section */}
          {recentEvents.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Recent Events</h3>
              <EventList events={recentEvents} />
            </div>
          )}
        </div>
      </PageSection>
      <Footer />
    </main>
  )
}
