"use client"

import React from "react"

interface RetroWindowProps {
  title?: string
  onClose?: () => void
  onScrollDown?: () => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function RetroWindow({
  title = "VGDC.EXE",
  onClose,
  onScrollDown,
  children,
  className = "",
  style,
}: RetroWindowProps) {
  return (
    <div
      className={`flex w-full flex-col border-2 border-white bg-black ${className}`}
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
            className="flex h-5 w-5 items-center justify-center border border-white bg-black text-[10px] leading-none text-white hover:bg-white hover:text-black"
            aria-label="Minimize — scroll to content"
            onClick={onScrollDown}
            style={{ fontFamily: "Mojangles, monospace" }}
          >
            -
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center border border-white bg-black text-[10px] leading-none text-white hover:bg-white hover:text-black"
            aria-label="Maximize"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
            style={{ fontFamily: "Mojangles, monospace" }}
          >
            □
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center border border-white bg-black text-[10px] leading-none text-white hover:bg-white hover:text-black"
            aria-label="Close — scroll to content"
            onClick={onScrollDown ?? onClose}
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
}
