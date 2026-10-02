"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
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

// Fullscreen support never changes, so there is nothing to subscribe to
const noopSubscribe = () => () => {}

export default function RetroWindowHero() {
  const [started, setStarted] = useState(false)
  const [runId, setRunId] = useState(0)
  const [gameOver, setGameOver] = useState<GameOverInfo | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canFullscreen = useSyncExternalStore(
    noopSubscribe,
    () => !!document.fullscreenEnabled,
    () => false
  )
  const titleRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  // Hidden title screen must not be focusable while playing (React 18 has no inert prop)
  useEffect(() => {
    if (titleRef.current) titleRef.current.inert = started
  }, [started])

  // Track fullscreen state so Esc-exits are reflected in the button
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === windowRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  function toggleFullscreen() {
    blurActive()
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      windowRef.current?.requestFullscreen().catch(() => {})
    }
  }

  function scrollToHero() {
    document.getElementById("retro-hero")?.scrollIntoView({ behavior: "smooth" })
  }

  function scrollToFeaturedGames() {
    document.getElementById("hero-content")?.scrollIntoView({ behavior: "smooth" })
  }

  function start() {
    blurActive()
    setGameOver(null)
    setStarted(true)
    scrollToHero()
  }

  function quit() {
    setGameOver(null)
    setStarted(false)
  }

  // X: back to the title screen (stays fullscreen if active)
  function close() {
    blurActive()
    quit()
  }

  // -: leave the game and scroll down to the page content
  async function minimize() {
    blurActive()
    quit()
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {})
    }
    scrollToFeaturedGames()
  }

  // End the run before leaving, so game keys stop capturing Space/arrows on the page
  function learnMore() {
    quit()
    scrollToFeaturedGames()
  }

  const restart = useCallback(() => {
    blurActive()
    setGameOver(null)
    setRunId((id) => id + 1)
    scrollToHero()
  }, [])

  return (
    <div id="retro-hero" className="flex w-full items-center justify-center p-3 sm:p-12 md:p-20 lg:p-28">
      <RetroWindow
        ref={windowRef}
        title={started ? "VGDC.GAME" : "VGDC.HOMESCREEN"}
        className={isFullscreen ? "h-full w-full" : "aspect-[4/3] w-full sm:aspect-video"}
        onMinimize={minimize}
        onClose={close}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        canFullscreen={canFullscreen}
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
                onLearnMore={learnMore}
                onQuit={quit}
              />
            )}
          </AnimatePresence>

          <motion.div
            ref={titleRef}
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
