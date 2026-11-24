"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"

/** idle: slow chase, spin: fast chase, win: all bulbs blink */
export type MarqueeMode = "idle" | "spin" | "win"

const TRACK = 18 // bulb track width around the machine, px
const SPACING = 24 // target gap between bulb centers, px

const CHASE_SPEED: Record<Exclude<MarqueeMode, "win">, string> = {
  idle: "0.9s",
  spin: "0.24s",
}

// VGDC logo colors (v, g, d, c in tailwind.config.ts)
const BULB_COLORS = ["#267392", "#3c99aa", "#0eb9ae", "#50d0a1"]

type Point = { x: number; y: number }

/** Bulb centers clockwise around a w × h box, from the top-left corner. */
function bulbPositions(w: number, h: number): Point[] {
  const inset = TRACK / 2
  const left = inset
  const top = inset
  const right = w - inset
  const bottom = h - inset
  let nx = Math.max(2, Math.round((right - left) / SPACING))
  const ny = Math.max(2, Math.round((bottom - top) / SPACING))
  // A multiple of 3 keeps the every-3rd-bulb chase seamless where it wraps
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

/** Frames its children with marquee bulbs that chase clockwise. */
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

  // Re-lay the bulbs when the frame resizes
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
          // Every 3rd bulb is lit; staggered delays move the light clockwise
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
