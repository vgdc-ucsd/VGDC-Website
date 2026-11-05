"use client"

import { useRef } from "react"
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"

type SlotLeverProps = {
  onPull: () => void
  disabled: boolean
}

// Knob diameter in px (must match the h-/w- classes on the knob)
const KNOB = 28

/**
 * A slot machine lever: a knob riding in a vertical track.
 * Click it (or Enter/Space) to pull, or drag the knob down past halfway.
 */
export default function SlotLever({ onPull, disabled }: SlotLeverProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const knobY = useMotionValue(0)
  // The stick hangs from the knob's center down to the base
  const stickTop = useTransform(knobY, (y) => y + KNOB / 2)
  // A drag ends with a click event too; this stops it from pulling twice
  const justDragged = useRef(false)

  function travel() {
    return (trackRef.current?.clientHeight ?? 0) - KNOB
  }

  function pull() {
    if (disabled) return
    if (justDragged.current) {
      justDragged.current = false
      return
    }
    animate(knobY, [0, travel(), 0], { duration: 0.6, times: [0, 0.35, 1], ease: "easeInOut" })
    onPull()
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    justDragged.current = true
    // Spring back to the top either way
    animate(knobY, 0, { type: "spring", stiffness: 400, damping: 18 })
    if (!disabled && info.offset.y > travel() / 2) onPull()
  }

  return (
    <button
      type="button"
      onClick={pull}
      disabled={disabled}
      aria-label="Pull lever to spin"
      className="group flex h-full w-8 shrink-0 flex-col items-center py-1 disabled:cursor-not-allowed sm:w-12"
    >
      {/* Track */}
      <div ref={trackRef} className="relative w-full flex-1">
        {/* Stick */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-200 to-gray-500"
          style={{ top: stickTop }}
        />
        {/* Knob */}
        <motion.div
          drag={disabled ? false : "y"}
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ y: knobY, width: KNOB, height: KNOB }}
          className="absolute left-1/2 top-0 -ml-[14px] cursor-grab rounded-full bg-gradient-to-br from-vgdc-light-blue to-vgdc-light-green shadow-[0_0_12px_rgba(88,213,131,0.6)] ring-2 ring-white transition-[filter] active:cursor-grabbing group-disabled:cursor-not-allowed group-disabled:grayscale"
        />
      </div>
      {/* Base */}
      <div className="h-3 w-full rounded-sm border-2 border-white bg-black" />
    </button>
  )
}
