"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import RetroWindow from "./RetroWindow"
import HeroTitleScreen from "./HeroTitleScreen"
import VGDCGame from "./game/VGDCGame"
import GameOverScreen from "./game/GameOverScreen"
import type { GameOverInfo } from "./game/gameTypes"

// Drop focus from whatever was clicked (e.g. START) so Space goes to the game
// instead of re-activating a hidden button.
function blurActive() {
  ;(document.activeElement as HTMLElement | null)?.blur?.()
}

export default function RetroWindowHero() {
  const [started, setStarted] = useState(false)
  const [runId, setRunId] = useState(0)
  const [gameOver, setGameOver] = useState<GameOverInfo | null>(null)

  function scrollToContent() {
    document.getElementById("hero-content")?.scrollIntoView({ behavior: "smooth" })
  }

  function start() {
    blurActive()
    setGameOver(null)
    setStarted(true)
  }

  function quit() {
    setGameOver(null)
    setStarted(false)
  }

  const restart = useCallback(() => {
    blurActive()
    setGameOver(null)
    setRunId((id) => id + 1)
  }, [])

  return (
    <div className="flex w-full items-center justify-center p-3 sm:p-12 md:p-20 lg:p-28">
      <RetroWindow
        title={started ? "VGDC.GAME" : "VGDC.HOMESCREEN"}
        className="aspect-[4/3] w-full sm:aspect-video"
        // X / minimize: quit the game if started, else scroll to content
        onScrollDown={started ? quit : scrollToContent}
      >
        {/*
          Layers stacked inside the window content area:
            1. VGDCGame canvas — always mounted, fills the whole content area
            2. Game over overlay — shown after a run ends
            3. Title screen overlay — slides up on START, slides back down on quit
        */}
        <div className="relative h-full w-full overflow-hidden">
          <VGDCGame isActive={started} runId={runId} onGameOver={setGameOver} />

          <AnimatePresence>
            {started && gameOver && (
              <GameOverScreen
                key={runId}
                {...gameOver}
                onRestart={restart}
                onLearnMore={scrollToContent}
                onQuit={quit}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 z-30"
            animate={{ y: started ? "-100%" : "0%" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden={started}
          >
            <HeroTitleScreen onStart={start} />
          </motion.div>
        </div>
      </RetroWindow>
    </div>
  )
}
