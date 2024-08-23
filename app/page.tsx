import Navbar from "@/components/Navbar"
import Hero from "@/components/homepage/Hero"
import Mission from "@/components/homepage/Mission"
import EventList from "@/components/EventList"
import Design from "@/components/homepage/Design"
import BlogPreview from "@/components/homepage/BlogPreview"
import Games from "@/components/homepage/Games"
import Companies from "@/components/homepage/Companies"
import Footer from "@/components/Footer"

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
