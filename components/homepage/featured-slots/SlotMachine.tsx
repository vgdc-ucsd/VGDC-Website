"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import SlotReel from "./SlotReel"
import SlotLever from "./SlotLever"
import MarqueeLights from "./MarqueeLights"
import {
  REEL_COUNT,
  buildStrip,
  initialSlots,
  pickRandomSlots,
  pickWinner,
  type SlotGame,
} from "./slotLogic"

// Random-filler length of each reel's strip, before the target
const STRIP_MIN = 15
const STRIP_MAX = 25
// Reel i spins for BASE + i * STAGGER seconds, so they stop left to right
const SPIN_BASE = 1.4
const SPIN_STAGGER = 0.35

/**
 * The homepage "Featured Games" slot machine. Shows 5 sealed games;
 * the lever spins all reels and lands every one on the same random game.
 */
export default function SlotMachine({ games }: { games: SlotGame[] }) {
  const reduceMotion = useReducedMotion()

  // One strip per reel; the last item of each is what the reel shows
  const [strips, setStrips] = useState<SlotGame[][]>(() =>
    initialSlots(games).map((g) => [g])
  )
  const [spinId, setSpinId] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [hovered, setHovered] = useState<SlotGame | null>(null)
  const [winner, setWinner] = useState<SlotGame | null>(null)
  // Revealed when the last reel stops (null for the intro spin)
  const pendingWinner = useRef<SlotGame | null>(null)
  const lastWinner = useRef<SlotGame | null>(null)
  // Mirrors `spinning` for animation callbacks, which can fire with stale props
  const spinningRef = useRef(false)

  function spin(targets: SlotGame[], newWinner: SlotGame | null) {
    const newStrips = targets.map((target, i) => {
      if (reduceMotion) return [target]
      const length =
        STRIP_MIN + Math.floor(Math.random() * (STRIP_MAX - STRIP_MIN + 1))
      const current = strips[i][strips[i].length - 1]
      return buildStrip(games, current, target, length)
    })
    setStrips(newStrips)
    setSpinId((id) => id + 1)
    setHovered(null)

    // Nothing to animate (reduced motion): land right away
    if (newStrips.every((strip) => strip.length <= 1)) {
      setWinner(newWinner)
      return
    }
    pendingWinner.current = newWinner
    spinningRef.current = true
    setSpinning(true)
    setWinner(null)
  }

  // First time the machine scrolls into view: roll into a random lineup
  function introSpin() {
    spin(pickRandomSlots(games, REEL_COUNT), null)
  }

  function pullLever() {
    if (spinningRef.current) return
    const chosen = pickWinner(games, lastWinner.current)
    lastWinner.current = chosen
    spin(Array(REEL_COUNT).fill(chosen), chosen)
  }

  // Only the last (slowest) reel ends the spin
  function onReelStop(i: number) {
    if (i !== REEL_COUNT - 1 || !spinningRef.current) return
    spinningRef.current = false
    setSpinning(false)
    setWinner(pendingWinner.current)
  }

  function onHover(game: SlotGame | null) {
    if (!spinning) setHovered(game)
  }

  // What the marquee says, by priority
  let display: string
  if (spinning) display = "SPINNING..."
  else if (hovered) display = hovered.title
  else if (winner) display = winner.title
  else display = "PULL THE LEVER!"
  const year = !spinning && (hovered ?? winner)?.releaseDate.slice(-4)

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={introSpin}
      transition={{ delay: 0.2, ease: "easeOut", duration: 0.4 }}
      className="mb-8 font-mojangles md:mb-16"
    >
      <MarqueeLights
        mode={spinning ? "spin" : winner ? "win" : "idle"}
        className="border-2 border-white bg-neutral-900"
      >
        <div className="border-2 border-white bg-black">
          {/* Marquee title display */}
          <div className="border-b-2 border-white p-2 sm:p-4">
            <div
              aria-live="polite"
              className="relative flex h-12 items-center justify-center overflow-hidden rounded bg-neutral-950 px-3 shadow-[inset_0_0_16px_rgba(0,0,0,0.9)] ring-1 ring-gray-700 sm:h-16"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={display}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={`truncate text-center text-sm text-vgdc-light-green [text-shadow:0_0_8px_rgba(88,213,131,0.8)] sm:text-2xl ${
                    winner && !hovered ? "animate-pulse" : ""
                  }`}
                >
                  {display}
                  {spinning && <span className="animate-pulse">_</span>}
                  {year && (
                    <span className="ml-3 text-hot-pink [text-shadow:none]">
                      {year}
                    </span>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Reels + lever */}
          <div className="flex items-stretch gap-2 p-2 sm:gap-4 sm:p-4">
            <div className="grid flex-1 grid-cols-5 gap-1.5 sm:gap-3 lg:gap-4">
              {strips.map((strip, i) => (
                <SlotReel
                  key={i}
                  strip={strip}
                  spinId={spinId}
                  duration={SPIN_BASE + i * SPIN_STAGGER}
                  spinning={spinning}
                  highlight={!spinning && winner !== null}
                  onStop={() => onReelStop(i)}
                  onHover={onHover}
                />
              ))}
            </div>
            <SlotLever onPull={pullLever} disabled={spinning} />
          </div>

          {/* Play button, shown once the lever lands on a winner */}
          <AnimatePresence>
            {winner && !spinning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="flex justify-center border-t-2 border-white p-3 sm:p-4">
                  <motion.a
                    href={winner.link || "/games"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="border-2 border-white bg-black px-4 py-2 text-sm text-white hover:bg-white hover:text-black sm:px-6 sm:text-lg"
                  >
                    ▶ PLAY THE GAME
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MarqueeLights>
    </motion.div>
  )
}
