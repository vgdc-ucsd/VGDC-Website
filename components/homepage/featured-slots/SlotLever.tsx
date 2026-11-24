"use client"

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"

type SlotLeverProps = {
  onPull: () => void
  disabled: boolean
}

const PULL_DURATION = 0.4
const BOTTOM_HOLD = 0.5
const RETURN_DURATION = 0.5

/** A handle that slides down a tall, fixed slot to spin the machine. */
export default function SlotLever({ onPull, disabled }: SlotLeverProps) {
  const reduceMotion = useReducedMotion()
  const instructionsId = useId()
  const trackRef = useRef<HTMLSpanElement>(null)
  const progress = useMotionValue(0)
  const pulling = useRef(false)
  const dragged = useRef(false)
  const keyboardPull = useRef(false)
  const gesture = useRef<{
    pointerId: number
    startY: number
    startProgress: number
  } | null>(null)

  const knobY = useTransform(progress, (p) => `${p * 100}%`)

  useEffect(() => () => progress.stop(), [progress])

  function returnToRest() {
    animate(progress, 0, {
      duration: reduceMotion ? 0 : 0.35,
      ease: [0.4, 0, 0.2, 1],
    })
  }

  function pull() {
    if (disabled || pulling.current) return
    if (reduceMotion) {
      progress.set(0)
      onPull()
      return
    }

    pulling.current = true
    animate(progress, 1, {
      duration: PULL_DURATION * (1 - progress.get()),
      ease: [0.45, 0, 0.7, 1],
      onComplete: () => {
        // Engage at the bottom and hold the weight before easing back up.
        onPull()
        animate(progress, 0, {
          delay: BOTTOM_HOLD,
          duration: RETURN_DURATION,
          ease: [0.4, 0, 0.2, 1],
          onComplete: () => {
            pulling.current = false
          },
        })
      },
    })
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (
      disabled ||
      pulling.current ||
      keyboardPull.current ||
      !event.isPrimary ||
      event.button !== 0
    )
      return
    progress.stop()
    dragged.current = false
    gesture.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startProgress: progress.get(),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId || disabled) return
    const distance = event.clientY - active.startY
    if (Math.abs(distance) > 4) dragged.current = true
    if (!dragged.current) return
    const travel = Math.max(1, trackRef.current?.clientHeight ?? 1)
    progress.set(
      Math.max(0, Math.min(1, active.startProgress + distance / travel))
    )
  }

  function onPointerUp(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current
    if (active?.pointerId !== event.pointerId) return
    gesture.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    if (
      !disabled &&
      dragged.current &&
      event.clientY - active.startY > 4 &&
      progress.get() >= 0.5
    )
      pull()
    else returnToRest()
  }

  // Holding Down Arrow provides the keyboard equivalent of dragging. A click,
  // Enter, Space, or a brief key press cannot skip the pull gesture.
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown") return
    event.preventDefault()
    if (disabled || pulling.current || gesture.current) return
    keyboardPull.current = true
    progress.stop()
    progress.set(Math.min(1, progress.get() + 0.2))
  }

  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" || !keyboardPull.current) return
    event.preventDefault()
    keyboardPull.current = false
    if (!disabled && progress.get() >= 0.5) pull()
    else returnToRest()
  }

  function cancelDrag() {
    if (!gesture.current && !keyboardPull.current) return
    gesture.current = null
    keyboardPull.current = false
    dragged.current = true
    returnToRest()
  }

  return (
    <button
      type="button"
      onClick={() => {
        // A click hints at the downward gesture without engaging the machine.
        // Ignore the synthetic click after a drag so it cannot interrupt a pull.
        if (
          disabled ||
          pulling.current ||
          dragged.current ||
          keyboardPull.current ||
          reduceMotion
        )
          return
        animate(progress, [progress.get(), 0.15, 0], {
          duration: 0.5,
          times: [0, 0.4, 1],
          ease: [0.4, 0, 0.2, 1],
        })
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={cancelDrag}
      onLostPointerCapture={cancelDrag}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={cancelDrag}
      disabled={disabled}
      aria-label="Drag lever down to spin"
      aria-describedby={instructionsId}
      title="Drag down to spin"
      className="group relative min-h-20 w-11 shrink-0 cursor-grab touch-none select-none self-stretch outline-none focus-visible:ring-2 focus-visible:ring-vgdc-light-green focus-visible:ring-offset-2 focus-visible:ring-offset-black active:cursor-grabbing disabled:cursor-not-allowed sm:w-12"
    >
      <span id={instructionsId} className="sr-only">
        Drag down past halfway and release. With a keyboard, hold Down Arrow,
        then release.
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 inset-y-0 border-2 border-white bg-neutral-900"
      />
      <span
        ref={trackRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 inset-y-4"
      >
        <svg className="h-full w-full overflow-visible" aria-hidden="true">
          {/* The guide stays fixed while the handle travels straight down. */}
          <line
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            className="stroke-neutral-600"
            strokeWidth="4"
          />
          <motion.circle
            cx="50%"
            cy={knobY}
            r="12"
            strokeWidth="2"
            className="fill-vgdc-light-green stroke-white transition-colors group-hover:fill-white group-disabled:fill-neutral-500 motion-reduce:transition-none"
          />
        </svg>
      </span>
    </button>
  )
}
