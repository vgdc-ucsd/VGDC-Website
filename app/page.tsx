import Navbar from "@/components/global/Navbar"
import Hero from "@/components/homepage/sections/Hero"
import Mission from "@/components/homepage/sections/Mission"
import EventsPreview from "@/components/homepage/sections/EventsPreview"
import Design from "@/components/homepage/sections/Design"
import BlogPreview from "@/components/homepage/sections/BlogPreview"
import Games from "@/components/homepage/sections/Games"
import Companies from "@/components/homepage/sections/Companies"
import Footer from "@/components/global/Footer"

/**
 * The website homepage
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar offsetSpace={true} />
      <Hero />
      <Mission />
      <EventsPreview />
      <Design />
      <BlogPreview />
      {/* <Games /> */}
      <Companies />
      <Footer />
    </main>
  )
}
