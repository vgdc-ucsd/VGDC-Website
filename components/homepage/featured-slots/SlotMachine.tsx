"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import SlotReel from "./SlotReel"
import SlotLever from "./SlotLever"
import MarqueeLights from "./MarqueeLights"
import GameMarquee from "./GameMarquee"
import styles from "./SlotMachine.module.css"
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
  const [hasPulled, setHasPulled] = useState(false)
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
    setHasPulled(true)
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
  if (spinning) display = "UC San Diego VGDC Features..."
  else if (hovered) display = hovered.title
  else if (winner) display = winner.title
  else display = "TAKE A SPIN!"
  const displayedGame = spinning ? null : (hovered ?? winner)
  const year = displayedGame?.releaseDate.slice(-4)
  const credits = displayedGame?.credits.trim()
  const canPlay = !spinning && winner !== null

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={introSpin}
      transition={{ delay: 0.2, ease: "easeOut", duration: 0.4 }}
      className="mb-8 font-mojangles md:mb-12"
    >
      <div className={styles.cabinet}>
        <Image
          src="/slot-machine-frame.png"
          alt=""
          width={1121}
          height={673}
          unoptimized
          draggable={false}
          className={styles.artwork}
        />
        {/* Marquee title display */}
        <div className={styles.marquee}>
          <div
            aria-live="polite"
            className="relative flex h-full items-center justify-center overflow-hidden bg-black px-3"
          >
            <GameMarquee
              key={displayedGame?.id ?? display}
              title={display}
              year={year}
              credits={credits}
              spinning={spinning}
            />
          </div>
        </div>

        {/* Reels + lever */}
        <div className={styles.reelBay}>
          <MarqueeLights
            mode={spinning ? "spin" : winner ? "win" : "idle"}
            className="h-full overflow-hidden bg-black"
          >
            <div className="flex h-full items-stretch gap-1.5 sm:gap-3">
              <div className={styles.reels}>
                {strips.map((strip, i) => (
                  <SlotReel
                    key={i}
                    strip={strip}
                    spinId={spinId}
                    duration={SPIN_BASE + i * SPIN_STAGGER}
                    spinning={spinning}
                    onStop={() => onReelStop(i)}
                    onHover={onHover}
                  />
                ))}
              </div>
              <SlotLever
                onPull={pullLever}
                disabled={spinning}
                showHint={!hasPulled}
              />
            </div>
          </MarqueeLights>
        </div>

        {/* Play button: appears on the first pull, disabled while spinning */}
        {hasPulled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={styles.play}
          >
            <motion.a
              role="link"
              href={canPlay ? winner.link || "/games" : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!canPlay}
              tabIndex={canPlay ? 0 : -1}
              whileHover={canPlay ? { scale: 1.05 } : undefined}
              whileTap={canPlay ? { scale: 0.96 } : undefined}
              className={`inline-flex min-h-11 items-center px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-vgdc-light-green sm:px-6 sm:text-lg ${
                canPlay
                  ? "text-white hover:bg-black/20"
                  : "cursor-wait text-white/60"
              }`}
            >
              ▶ PLAY THE GAME
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
