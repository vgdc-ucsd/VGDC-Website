"use client"

import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import GameCard from "./GameCard"
import ApprovalSeal from "./ApprovalSeal"
import { Eye } from "lucide-react"

interface GameGridProps {
  gameData: ShowcaseGamesDetails[]
  setCurrentIndex(index: number): void
  setShowModal(isOpen: boolean): void
}

export default function GamesGrid({
  gameData,
  setCurrentIndex,
  setShowModal,
}: GameGridProps) {
  return (
    <div className="mx-auto grid max-w-fit grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {gameData.map((game, index) => (
        <div className="m-2 w-80 sm:w-56" key={index}>
          <GameCard
            game={game}
            getStatusText={(status) => (status ? "Released" : "In Development")}
            onClick={() => {
              setCurrentIndex(index)
              setShowModal(true)
            }}
          />
        </div>
      ))}
    </div>
  )
}
