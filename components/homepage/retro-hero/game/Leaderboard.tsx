"use client"

import { motion } from "framer-motion"
import type { LeaderboardResult } from "@/lib/leaderboard"

interface LeaderboardProps {
  board: LeaderboardResult | "loading" | "error"
  onBack: () => void
}

const textSize = { fontSize: "clamp(0.55rem, 1.2vw, 0.95rem)" }

function statusText(board: LeaderboardProps["board"]) {
  if (board === "loading") return "LOADING..."
  if (board === "error") return "UNAVAILABLE"
  if (board.entries.length === 0) return "NO SCORES YET"
  return null
}

export default function Leaderboard({ board, onBack }: LeaderboardProps) {
  const status = statusText(board)

  return (
    <div
      className="flex w-full max-w-[26em] flex-col items-center text-center text-white"
      style={{ fontFamily: "Mojangles, monospace" }}
    >
      <h2
        className="leading-none"
        style={{ fontSize: "clamp(1rem, 3vw, 2.4rem)", textShadow: "3px 3px 0 rgba(0,0,0,0.6)" }}
      >
        LEADERBOARD
      </h2>

      <div className="mt-[1em] w-full border-2 border-white bg-black/70 px-[1em] py-[0.8em] text-left" style={textSize}>
        {status ? (
          <p className="text-center text-white/60">{status}</p>
        ) : (
          <ol className="flex flex-col gap-[0.25em]">
            {typeof board === "object" &&
              board.entries.map((entry, i) => {
                const isYou = entry.id === board.entryId
                return (
                  <li key={entry.id} className={`flex items-baseline gap-[0.6em] ${isYou ? "text-vgdc-light-green" : ""}`}>
                    <span className="w-[2ch] shrink-0 text-right text-white/60">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">
                      {entry.displayName}
                      {isYou && " ◀"}
                    </span>
                    <span className="shrink-0">{String(entry.score).padStart(5, "0")}</span>
                  </li>
                )
              })}
          </ol>
        )}
      </div>

      <motion.button
        onClick={onBack}
        className="mt-[1em] border-2 border-white bg-black px-[1.2em] py-[0.5em] hover:bg-white hover:text-black"
        style={textSize}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        autoFocus
      >
        ◂ BACK
      </motion.button>
    </div>
  )
}
