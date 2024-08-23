import Navbar from "@/components/Navbar"
import Hero from "@/components/homepage/sections/Hero"
import Mission from "@/components/homepage/sections/Mission"
import EventList from "@/components/EventList"
import Design from "@/components/homepage/sections/Design"
import BlogPreview from "@/components/homepage/sections/BlogPreview"
import Games from "@/components/homepage/sections/Games"
import Companies from "@/components/homepage/sections/Companies"
import Footer from "@/components/Footer"

/**
 * The website homepage
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar offsetSpace={false} />
      <Hero />
      <Mission />
      <EventList />
      <Design />
      <BlogPreview />
      <Games />
      <Companies />
      <Footer />
    </main>
  )
}
