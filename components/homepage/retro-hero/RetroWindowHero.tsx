"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import RetroWindow from "./RetroWindow"
import HeroTitleScreen from "./HeroTitleScreen"
import VGDCGame from "./game/VGDCGame"

export default function RetroWindowHero() {
  const [started, setStarted] = useState(false)

  function scrollToContent() {
    document.getElementById("hero-content")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex w-full items-center justify-center p-12 md:p-20 lg:p-28">
      <RetroWindow
        title={started ? "VGDC.GAME" : "VGDC.HOMESCREEN"}
        className="w-full aspect-video"
        // X / minimize: quit the game if started, else scroll to content
        onScrollDown={started ? () => setStarted(false) : scrollToContent}
      >
        {/*
          Two layers stacked inside the window content area:
            1. VGDCGame canvas — always mounted, always rendering behind the overlay
            2. Overlay motion.div — slides up on START, slides back down on quit

          The parent div is overflow-hidden so the overlay disappears above the window
          edge as it slides up, cleanly revealing the game canvas underneath.
        */}
        <div className="relative h-full w-full overflow-hidden">
          <VGDCGame isActive={started} />

          <motion.div
            className="absolute inset-0 z-10"
            animate={{ y: started ? "-100%" : "0%" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <HeroTitleScreen onStart={() => setStarted(true)} />
          </motion.div>
        </div>
      </RetroWindow>
    </div>
  )
}
