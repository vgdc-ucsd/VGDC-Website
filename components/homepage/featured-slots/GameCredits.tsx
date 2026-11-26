"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { useReducedMotion } from "framer-motion"
import styles from "./SlotMachine.module.css"

/** Only scroll credits that are wider than the marquee's available space. */
export default function GameCredits({
  credits,
  onDurationChange,
}: {
  credits: string
  onDurationChange: (duration: number) => void
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const viewport = viewportRef.current
    const text = textRef.current
    if (!viewport || !text) return

    const measure = () => {
      const nextDistance =
        text.offsetWidth > viewport.clientWidth ? text.offsetWidth + 32 : 0
      setDistance(nextDistance)
      // Let the complete credit list pass before flipping back to the title.
      onDurationChange(
        nextDistance ? Math.max(12, nextDistance / 35) * 1000 + 1000 : 5000
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(text)
    measure()
    return () => observer.disconnect()
  }, [credits, onDurationChange])

  const scrolling = distance > 0 && !reduceMotion

  return (
    <div
      ref={viewportRef}
      className={styles.credits}
      tabIndex={distance > 0 ? 0 : undefined}
      title={`Credits: ${credits}`}
      style={
        {
          "--credits-distance": `-${distance}px`,
          "--credits-duration": `${Math.max(12, distance / 35)}s`,
        } as CSSProperties
      }
    >
      <div
        className={`${styles.creditsTrack} ${scrolling ? styles.creditsScrolling : ""}`}
      >
        <span ref={textRef}>Credits: {credits}</span>
        {scrolling && <span aria-hidden="true">Credits: {credits}</span>}
      </div>
    </div>
  )
}
