"use client"

import React, { forwardRef } from "react"

interface RetroWindowProps {
  title?: string
  onMinimize?: () => void
  onClose?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  // Hide the fullscreen button where the browser doesn't support it
  canFullscreen?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const buttonClass =
  "flex h-5 w-5 items-center justify-center border border-white bg-black text-[10px] leading-none text-white hover:bg-white hover:text-black"

const RetroWindow = forwardRef<HTMLDivElement, RetroWindowProps>(function RetroWindow(
  {
    title = "VGDC.HOMESCREEN",
    onMinimize,
    onClose,
    onToggleFullscreen,
    isFullscreen = false,
    canFullscreen = true,
    children,
    className = "",
    style,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex w-full flex-col bg-black ${isFullscreen ? "" : "border-2 border-white"} ${className}`}
      style={style}
    >
      {/* Title bar */}
      <div className="flex h-8 shrink-0 select-none items-center gap-2 bg-black px-2">
        {/* Title */}
        <span
          className="flex-1 text-xs text-white"
          style={{ fontFamily: "Mojangles, monospace" }}
        >
          {title}
        </span>
        {/* Control buttons */}
        <div className="flex items-center gap-1">
          <button
            className={buttonClass}
            aria-label="Minimize — scroll to content"
            onClick={onMinimize}
            style={{ fontFamily: "Mojangles, monospace" }}
          >
            -
          </button>
          {canFullscreen && (
            <button
              className={buttonClass}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              onClick={onToggleFullscreen}
              style={{ fontFamily: "Mojangles, monospace" }}
            >
              {isFullscreen ? "❐" : "□"}
            </button>
          )}
          <button
            className={buttonClass}
            aria-label="Close — back to start"
            onClick={onClose}
            style={{ fontFamily: "Mojangles, monospace" }}
          >
            X
          </button>
        </div>
      </div>

      {/* Title bar separator */}
      <div className="h-px shrink-0 bg-white" />

      {/* Content area */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {children}
      </div>
    </div>
  )
})

export default RetroWindow
