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
      className={`flex w-full flex-col border-2 border-[#1a1a2e] bg-[#2c2c3a] shadow-win95-raised ${className}`}
      style={style}
    >
      {/* Title bar */}
      <div className="flex h-7 shrink-0 select-none items-center gap-1 bg-[#297892] px-1.5">
        {/* Window icon */}
        <span className="text-[10px] leading-none"></span>
        {/* Title */}
        <span className="flex-1 pl-0.5 text-xs font-bold tracking-wide text-white">
          {title}
        </span>
        {/* Control buttons */}
        <div className="flex items-center gap-0.5">
          <button
            className="flex h-4 w-4 items-center justify-center bg-[#2c2c3a] text-[9px] font-bold leading-none text-white shadow-win95-button hover:bg-[#3c3c4a]"
            aria-label="Minimize — scroll to content"
            onClick={onScrollDown}
          >
            _
          </button>
          <button
            className="flex h-4 w-4 items-center justify-center bg-[#2c2c3a] text-[9px] font-bold leading-none text-white shadow-win95-button hover:bg-[#3c3c4a]"
            aria-label="Maximize"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
          >
            □
          </button>
          <button
            className="flex h-4 w-4 items-center justify-center bg-[#2c2c3a] text-[9px] font-bold leading-none text-white shadow-win95-button hover:bg-red-700 hover:text-white"
            aria-label="Close — scroll to content"
            onClick={onScrollDown ?? onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <div className="flex h-6 shrink-0 select-none items-center border-b border-[#1a1a2e] bg-[#2c2c3a] px-2 gap-4">
        {["File", "Edit", "Help"].map((item) => (
          <span
            key={item}
            className="cursor-default text-[11px] text-[#a0a0c0] hover:bg-[#58d583] hover:text-white px-1"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Content area */}
      <div className="relative flex-1 overflow-hidden bg-background-grey">
        {children}
      </div>
    </div>
  )
}
