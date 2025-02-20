import Navbar from "@/components/global/Navbar"

import { getShowcaseGames } from "@/lib/showcase_games"

export const revalidate = 60;

export default async function Showcase() {
  let games = await getShowcaseGames(true)

  return (
    <main>
      <Navbar />
      <div>This is the Showcase</div>
    </main>
  )
}
