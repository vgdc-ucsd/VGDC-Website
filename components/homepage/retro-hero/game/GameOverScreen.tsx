"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import type { GameOverInfo } from "./gameTypes"

interface GameOverScreenProps extends GameOverInfo {
  onRestart: () => void
  onLearnMore: () => void
  onQuit: () => void
}

// Ignore keys for a moment so a held/mashed jump key doesn't instantly restart
const KEY_GUARD_MS = 500

const pixelFont = { fontFamily: "Mojangles, monospace" }

export default function GameOverScreen({
  score,
  best,
  isNewBest,
  onRestart,
  onLearnMore,
  onQuit,
}: GameOverScreenProps) {
  useEffect(() => {
    const shownAt = performance.now()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "KeyR") return
      const target = e.target as HTMLElement | null
      if (target?.closest("button, a, input, textarea, select, [contenteditable]")) return
      e.preventDefault()
      if (performance.now() - shownAt > KEY_GUARD_MS && !e.repeat) onRestart()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onRestart])

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-[3%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label="Game over"
    >
      <motion.div
        className="flex flex-col items-center text-center text-white"
        style={pixelFont}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
      >
        <h2
          className="leading-none"
          style={{
            fontSize: "clamp(1.25rem, 4.5vw, 3.5rem)",
            textShadow: "3px 3px 0 rgba(0,0,0,0.6)",
          }}
        >
          GAME OVER
        </h2>

        <div
          className="mt-[0.6em] flex items-baseline gap-[1.5em]"
          style={{ fontSize: "clamp(0.6rem, 1.5vw, 1.15rem)" }}
        >
          <p>
            SCORE <span className="text-vgdc-light-green">{String(score).padStart(5, "0")}</span>
          </p>
          <p>
            HIGH SCORE <span className="text-vgdc-light-blue">{String(best).padStart(5, "0")}</span>
          </p>
        </div>

        {isNewBest && score > 0 && (
          <motion.p
            className="mt-[0.4em] text-vgdc-light-blue"
            style={{ fontSize: "clamp(0.55rem, 1.2vw, 0.95rem)" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            ★ NEW HIGH SCORE! ★
          </motion.p>
        )}

        <div
          className="mt-[1.1em] flex flex-col items-center gap-[0.4em]"
          style={{ fontSize: "clamp(0.55rem, 1.2vw, 0.95rem)" }}
        >
          <motion.button
            onClick={onRestart}
            className="border-2 border-white bg-black px-[1.2em] py-[0.5em] hover:bg-white hover:text-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            ↻ RESTART
          </motion.button>
          <button
            onClick={onQuit}
            className="px-[0.5em] py-[0.5em] text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            QUIT
          </button>
        </div>

        {/* Club CTA — takes them to the club info below the hero */}
        <motion.button
          onClick={onLearnMore}
          className="mt-[1.4em] px-[0.4em] py-[0.2em] text-white underline-offset-[0.25em] hover:text-vgdc-light-blue hover:underline"
          style={{
            fontSize: "clamp(0.95rem, 2.4vw, 1.9rem)",
            textShadow: "3px 3px 0 rgba(0,0,0,0.6)",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          LEARN ABOUT OUR CLUB
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
