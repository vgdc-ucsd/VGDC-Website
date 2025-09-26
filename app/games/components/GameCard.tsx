"use client"

import React from "react"
import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import Image from "next/image"
import { ExternalLink, Eye } from "lucide-react"
import ApprovalSeal from "./ApprovalSeal"

export type GameStatus = "Released" | "In Development"

type GameCardProps = {
  game: ShowcaseGamesDetails
  onClick: () => void
  getStatusText: (status: boolean) => GameStatus
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  getStatusText,
}) => {
  return (
    <div
      className="perspective-1000 group transform-gpu cursor-pointer transition-all duration-500 hover:scale-105"
      onClick={onClick}
    >
      {/* Box Container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-background-black to-footer-grey shadow-lg">
        {/* Game Cover Image */}
        <div className="h-3/4 w-full overflow-hidden">
          {game.image ? (
            <div
              className="aspect-square w-full"
              style={{
                backgroundImage: `url(${game.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-background-black">
              <p className="text-center text-gray-400">No image</p>
            </div>
          )}

          {/* Approval Sticker */}
          {game.vgdcApproved && (
            <div className="absolute right-3 top-3 overflow-hidden">
              <ApprovalSeal color="#debb18ff" className="h-20 w-20" />
            </div>
          )}
        </div>

        {/* Game Information - Bottom Info */}
        <div className="w-full bg-footer-grey p-3">
          {/* <div className="aspect-square w-full opacity-0"></div> */}
          <h3 className="mb-1 line-clamp-1 text-base font-bold text-white">
            {game.title}
          </h3>

          <div className="mb-2 flex flex-wrap gap-1">
            <span
              className={`rounded-full ${getStatusText(game.status) === "Released" ? "bg-green-500" : "bg-yellow-500"} px-2 py-0.5 text-xs text-white`}
            >
              {getStatusText(game.status)}
            </span>

            {game.web && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                Web
              </span>
            )}
          </div>

          <p className="line-clamp-2 h-8 text-xs text-gray-300">
            {game.description}
          </p>
        </div>

        {/* Click overlay on hover*/}
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all hover:bg-opacity-20">
          <div className="flex h-full w-full items-start justify-center opacity-0 transition-opacity hover:opacity-100">
            <div className="flex h-3/4 w-full items-center justify-center">
              <span className="rounded-full bg-background-black/50 p-5 text-4xl text-white">
                <Eye className="h-10 w-10" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameCard
