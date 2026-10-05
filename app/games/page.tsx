import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import { getShowcaseGames } from "@/lib/showcase_games"
import ShowcaseSearch from "./components/ShowcaseSearch"
import GamesGrid from "./components/GamesGrid"
import { notFound } from "next/navigation"

export const revalidate = 60

export default async function Showcase() {
  const result = await getShowcaseGames();
  if (!result.ok) notFound();
  const showcaseData = result.data;

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <h1 className="text-center text-3xl font-bold text-white">
          Game Showcase
        </h1>
        <p className="mb-2 text-center text-sm text-gray-500">
          Explore amazing games created by our community members
        </p>
        <ShowcaseSearch data={showcaseData} />
      </div>
      <Footer />
    </main>
  )
}
