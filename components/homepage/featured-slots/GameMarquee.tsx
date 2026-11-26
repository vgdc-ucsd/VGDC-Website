"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import GameCredits from "./GameCredits"

/** Alternate the title and credits in the same display, allowing a full scroll. */
export default function GameMarquee({
  title,
  year,
  credits,
  spinning,
}: {
  title: string
  year?: string
  credits?: string
  spinning: boolean
}) {
  const [showCredits, setShowCredits] = useState(false)
  const [creditsDuration, setCreditsDuration] = useState(5000)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!credits || paused) return
    const timer = setTimeout(
      () => setShowCredits((show) => !show),
      showCredits ? creditsDuration : 4000
    )
    return () => clearTimeout(timer)
  }, [credits, showCredits, creditsDuration, paused])

  return (
    <div
      className="flex w-full min-w-0 items-center justify-center text-center text-sm leading-none text-vgdc-light-green [perspective:600px] [text-shadow:0_0_8px_rgba(88,213,131,0.8)] sm:text-xl lg:text-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={showCredits ? "credits" : "title"}
          initial={{ opacity: 0, rotateX: reduceMotion ? 0 : 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          exit={{ opacity: 0, rotateX: reduceMotion ? 0 : -90 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
          className="w-full min-w-0"
        >
          {showCredits && credits ? (
            <GameCredits
              credits={credits}
              onDurationChange={setCreditsDuration}
            />
          ) : (
            <p className="truncate">
              {title}
              {spinning && <span className="animate-pulse">_</span>}
              {year && (
                <span className="ml-3 text-hot-pink [text-shadow:none]">
                  {year}
                </span>
              )}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
