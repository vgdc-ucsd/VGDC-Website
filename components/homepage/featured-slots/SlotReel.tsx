"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { stripEndY, type SlotGame } from "./slotLogic"

type SlotReelProps = {
  /** Games this reel scrolls through; the last one is where it stops. */
  strip: SlotGame[]
  /** Changes on every spin; restarts the animation. */
  spinId: number
  /** Seconds the spin lasts (later reels spin longer so they stop left to right). */
  duration: number
  spinning: boolean
  onStop: () => void
  onHover: (game: SlotGame | null) => void
}

export default function SlotReel({
  strip,
  spinId,
  duration,
  spinning,
  onStop,
  onHover,
}: SlotReelProps) {
  const n = strip.length
  const face = strip[n - 1]
  // Games without a link fall back to the showcase page
  const href = face.link || "/games"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={face.title}
      aria-disabled={spinning}
      tabIndex={spinning ? -1 : 0}
      onMouseEnter={() => onHover(face)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(face)}
      onBlur={() => onHover(null)}
      className={`group relative block aspect-square overflow-hidden rounded-sm border-2 border-white bg-black outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vgdc-light-green ${
        spinning ? "pointer-events-none" : ""
      }`}
    >
      {/* The strip: n items stacked, n × the window's height. A new key per spin restarts it at y = 0 */}
      <motion.div
        key={spinId}
        className="absolute inset-x-0 top-0"
        style={{ height: `${n * 100}%` }}
        initial={{ y: "0%" }}
        animate={{
          y: stripEndY(n),
          // Motion smear while the reel is moving fast
          filter: n > 1 ? ["blur(0px)", "blur(3px)", "blur(3px)", "blur(0px)"] : "blur(0px)",
        }}
        transition={{
          y: { duration: n > 1 ? duration : 0, ease: [0.15, 0.85, 0.3, 1.04] },
          filter: { duration: n > 1 ? duration : 0, times: [0, 0.1, 0.7, 1] },
        }}
        onAnimationComplete={onStop}
      >
        {strip.map((game, i) => (
          <div
            key={i}
            className="relative w-full"
            style={{ height: `${100 / n}%` }}
          >
            <SlotFace game={game} />
          </div>
        ))}
      </motion.div>

      {/* CRT scanline overlay, same as the hero title screen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
        }}
      />
      {/* Subtle tint that lifts on hover */}
      <div className="pointer-events-none absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0" />
      {/* Glass shine, like a real slot window */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </a>
  )
}

function SlotFace({ game }: { game: SlotGame }) {
  if (!game.image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900 p-1 text-center font-mojangles text-[8px] text-white sm:text-xs">
        {game.title}
      </div>
    )
  }
  return (
    <Image
      src={game.image}
      alt=""
      fill
      sizes="(min-width: 768px) 20vw, 18vw"
      className="object-cover transition-transform duration-300 group-hover:scale-110"
    />
  )
}
