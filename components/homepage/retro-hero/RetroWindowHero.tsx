"use client"

import RetroWindow from "./RetroWindow"
import HeroTitleScreen from "./HeroTitleScreen"

export default function RetroWindowHero() {
  function scrollToContent() {
    document.getElementById("hero-content")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex w-full items-center justify-center p-12 md:p-20 lg:p-28">
      <RetroWindow
        title="VGDC.EXE"
        className="w-full aspect-video"
        onScrollDown={scrollToContent}
      >
        <HeroTitleScreen />
      </RetroWindow>
    </div>
  )
}
