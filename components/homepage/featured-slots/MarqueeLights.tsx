"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"

/** idle: slow chase, spin: fast chase, win: every bulb blinks together */
export type MarqueeMode = "idle" | "spin" | "win"

// Width of the bulb track around the machine, in px
const TRACK = 18
// Target distance between bulb centers, in px
const SPACING = 24

const CHASE_SPEED: Record<Exclude<MarqueeMode, "win">, string> = {
  idle: "0.9s",
  spin: "0.24s",
}

// Bulbs cycle through the VGDC logo colors (v, g, d, c in tailwind.config.ts)
const BULB_COLORS = ["#267392", "#3c99aa", "#0eb9ae", "#50d0a1"]

type Point = { x: number; y: number }

/**
 * Bulb centers going clockwise around a w × h box, starting at the top-left
 * corner. The track runs down the middle of the TRACK-wide padding.
 */
function bulbPositions(w: number, h: number): Point[] {
  const inset = TRACK / 2
  const left = inset
  const top = inset
  const right = w - inset
  const bottom = h - inset
  let nx = Math.max(2, Math.round((right - left) / SPACING))
  const ny = Math.max(2, Math.round((bottom - top) / SPACING))
  // Keep the total a multiple of 3 so the every-3rd-bulb chase has no seam
  while ((2 * (nx + ny)) % 3 !== 0) nx++
  const dx = (right - left) / nx
  const dy = (bottom - top) / ny

  const points: Point[] = []
  for (let i = 0; i < nx; i++) points.push({ x: left + i * dx, y: top })
  for (let i = 0; i < ny; i++) points.push({ x: right, y: top + i * dy })
  for (let i = 0; i < nx; i++) points.push({ x: right - i * dx, y: bottom })
  for (let i = 0; i < ny; i++) points.push({ x: left, y: bottom - i * dy })
  return points
}

/**
 * Wraps its children in a frame of marquee bulbs that chase clockwise,
 * like the lights around a real slot machine.
 */
export default function MarqueeLights({
  mode,
  className = "",
  children,
}: {
  mode: MarqueeMode
  className?: string
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const [bulbs, setBulbs] = useState<Point[]>([])

  // Re-lay the bulbs whenever the frame resizes (e.g. the play button appears)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(() => {
      setBulbs(bulbPositions(frame.offsetWidth, frame.offsetHeight))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={frameRef}
      className={`relative ${className}`}
      style={{
        padding: TRACK,
        ["--chase-speed" as string]: mode === "win" ? undefined : CHASE_SPEED[mode],
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {bulbs.map((p, i) => {
          // Every 3rd bulb is lit; the delay shifts the pattern one bulb
          // forward each third of a cycle, so the light travels clockwise
          const phase = (3 - (i % 3)) % 3
          const color = BULB_COLORS[i % BULB_COLORS.length]
          const animation = reduceMotion
            ? ""
            : mode === "win"
              ? "animate-bulb-blink"
              : "animate-bulb-chase"
          return (
            <span
              key={i}
              className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-2.5 sm:w-2.5 ${animation}`}
              style={{
                left: p.x,
                top: p.y,
                backgroundColor: color,
                boxShadow: `0 0 6px 2px ${color}`,
                animationDelay:
                  mode === "win" ? undefined : `calc(var(--chase-speed) * ${-phase / 3})`,
              }}
            />
          )
        })}
      </div>
      {children}
    </div>
  )
}
