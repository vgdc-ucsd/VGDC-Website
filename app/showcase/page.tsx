import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import { getShowcaseData } from "@/lib/showcase"
import ShowcaseSearch from "./components/ShowcaseSearch"

export default async function Showcase() {
  const showcaseData = await getShowcaseData()

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Game Showcase
        </h1>
        <p className="mb-8 text-center text-sm text-gray-300">
          Explore amazing games created by our community members
        </p>
        
        <ShowcaseSearch data={showcaseData} />
      </div>
      <Footer />
    </main>
  )
}