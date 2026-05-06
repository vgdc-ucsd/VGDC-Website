"use client"

import { useEffect, useRef } from "react"
import type { VGDCGameProps } from "./gameTypes"

// Draws the static game scene onto the canvas.
// This function becomes the RAF loop's render() call in the full implementation.
function drawScene(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const { width: W, height: H } = canvas

  // Background
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, W, H)

  // Ground — 2px white bar at 82% of canvas height
  const groundY = Math.round(H * 0.82)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, groundY, W, 2)

  // Player — white square sitting on the ground, sized proportionally to canvas width
  const playerSize = Math.min(Math.round(W * 0.06), 48)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(Math.round(W * 0.12), groundY - playerSize, playerSize, playerSize)
}

export default function VGDCGame({ isActive }: VGDCGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ResizeObserver: keeps the canvas pixel buffer matched to its CSS layout size.
  // Without this, canvas.width/height defaults to 300x150 regardless of CSS.
  // Also redraws the scene whenever the window resizes so nothing stretches.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      drawScene(canvas)
    })

    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // isActive hook — full game loop starts/stops here in the full implementation.
  // e.g.: if (isActive) startLoop() else stopLoop() / reset()
  useEffect(() => {
    // placeholder
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      aria-label="VGDC mini game"
    />
  )
}
