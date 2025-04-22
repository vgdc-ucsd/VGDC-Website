"use client"

import React, { useCallback, useEffect, useState, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel"
import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ApprovalSeal from "./ApprovalSeal"

// Constants for effects
const TWEEN_FACTOR = 0.8
const PARALLAX_FACTOR = 2.0

// Helper function to keep number within range
const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

type GameCarouselProps = {
  filteredItems: ShowcaseGamesDetails[]
  currentIndex: number
  setCurrentIndex: (index: number) => void
  setShowModal: (show: boolean) => void
}

const GamesCarousel: React.FC<GameCarouselProps> = ({
  filteredItems,
  currentIndex,
  setCurrentIndex,
  setShowModal,
}) => {
  // Options for Embla Carousel - loop enabled and center alignment
  const options: EmblaOptionsType = { loop: true }
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  // Refs for effects
  const tweenFactor = useRef(TWEEN_FACTOR)
  const tweenNodes = useRef<HTMLElement[]>([])
  const parallaxNodes = useRef<HTMLElement[]>([])

  // Button states
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)

  // Setup for tween scaling effect
  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    // tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
    //   return slideNode.querySelector(".game-card") as HTMLElement
    // })
  }, [])

  // Setup for parallax effect
  const setParallaxNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    // parallaxNodes.current = emblaApi.slideNodes().map((slideNode) => {
    //   return slideNode.querySelector(".parallax-layer") as HTMLElement
    // })
  }, [])

  // Tween scaling effect implementation
  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      let scrollProgress = emblaApi.scrollProgress()
      let slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === "scroll"

      // if (filteredItems.length == 4) {
      //   scrollProgress /= 3
      //   scrollProgress += 1 / 3
      // } else if (filteredItems.length < 4) {
      //   console.log(scrollProgress)
      // }

      // console.log(scrollProgress, slidesInView)

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        const realIndex = filteredItems.length <= 4 ? snapIndex + 1 : snapIndex
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress)
                }
              }
            })
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
          const scale = numberWithinRange(tweenValue, 0.8, 1).toString()
          const tweenNode = tweenNodes.current[realIndex]
          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`

            // Adjust opacity based on scale to further emphasize the center card
            const opacity = numberWithinRange(tweenValue, 0.6, 1).toString()
            tweenNode.style.opacity = opacity
          }
        })
      })
    },
    [filteredItems]
  )

  // Parallax effect implementation
  const parallaxEffect = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === "scroll"

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress)
                }
              }
            })
          }

          // Apply parallax effect to image
          const translate = diffToTarget * (-1 * PARALLAX_FACTOR) * 100
          const parallaxNode = parallaxNodes.current[slideIndex]
          if (parallaxNode) {
            // parallaxNode.style.transform = `translateX(${translate}%)`
          }
        })
      })
    },
    []
  )

  // Navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    // Update current index
    setCurrentIndex(emblaApi.selectedScrollSnap())

    // With loop:true, we don't need to disable buttons, but keeping the states for consistency
    // setPrevBtnDisabled(false)
    // setNextBtnDisabled(false)

    // Apply effects on selection
    // tweenScale(emblaApi)
    // parallaxEffect(emblaApi)
  }, [emblaApi, setCurrentIndex /*, tweenScale, parallaxEffect*/])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index, false)
    },
    [emblaApi]
  )

  // Initialize and handle slide changes
  useEffect(() => {
    if (!emblaApi) return

    // Setup nodes for effects
    // setTweenNodes(emblaApi)
    // setParallaxNodes(emblaApi)

    // Initial effects
    // tweenScale(emblaApi)
    // parallaxEffect(emblaApi)

    // Setup event listeners
    emblaApi.on("select", onSelect)
    // .on("reInit", setTweenNodes)
    // .on("reInit", setParallaxNodes)
    // .on("reInit", tweenScale)
    // .on("reInit", parallaxEffect)
    // .on("scroll", () => {
    //   tweenScale(emblaApi, "scroll")
    //   parallaxEffect(emblaApi, "scroll")
    // })
    // .on("slideFocus", () => {
    //   tweenScale(emblaApi)
    //   parallaxEffect(emblaApi)
    // })

    // onSelect()

    return () => {
      emblaApi.off("select", onSelect).off("reInit", setTweenNodes)
      // .off("reInit", setParallaxNodes)
      // .off("reInit", tweenScale)
      // .off("reInit", parallaxEffect)
      // .off("scroll", () => {
      //   tweenScale(emblaApi, "scroll")
      //   parallaxEffect(emblaApi, "scroll")
      // })
      // .off("slideFocus", () => {
      //   tweenScale(emblaApi)
      //   parallaxEffect(emblaApi)
      // })
    }
  }, [
    emblaApi,
    onSelect,
    setTweenNodes,
    setParallaxNodes,
    tweenScale,
    parallaxEffect,
  ])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollPrev()
      } else if (e.key === "ArrowRight") {
        scrollNext()
      }
      // else if (e.key === "Enter") {
      //   setShowModal(true)
      // }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [scrollPrev, scrollNext, setShowModal])

  // Sync carousel with currentIndex from parent
  // useEffect(() => {
  //   if (emblaApi && emblaApi.selectedScrollSnap() !== currentIndex) {
  //     if (filteredItems.length > 4) {
  //       scrollTo(currentIndex)
  //     } else {
  //       scrollTo(Math.min(currentIndex, filteredItems.length - 3))
  //     }
  //   }
  //   console.log(currentIndex)
  // }, [currentIndex, emblaApi, scrollTo])

  // Handle empty state
  if (filteredItems.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-background-grey bg-background-black p-8">
        <p className="text-center text-xl text-gray-400">
          No games match your search criteria
        </p>
      </div>
    )
  }

  // Get status text helper
  const getStatusText = (status: boolean) => {
    return status ? "Released" : "In Development"
  }

  return (
    <div className="relative px-4 md:px-12">
      {/* Embla Carousel */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex py-10">
          {filteredItems.map((game, index) => (
            <div
              key={index}
              className="embla__slide relative min-w-0 flex-[0_0_65%] px-4 md:flex-[0_0_50%] lg:flex-[0_0_33%]"
            >
              {/* Game Card */}
              <div
                className="game-card relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg transition-all will-change-transform"
                onClick={() => {
                  // Update the current index first, then show the modal
                  setCurrentIndex(index)
                  setShowModal(true)
                }}
                style={{ transform: "scale(1)", opacity: "1" }}
              >
                {/* Game Cover Image with Parallax Effect */}
                <div className="relative h-full w-full overflow-hidden">
                  {game.image ? (
                    <div className="h-full w-full overflow-hidden">
                      {/* Parallax container */}
                      <div
                        className="parallax-layer relative h-full w-full"
                        style={{ transform: "translateX(0%)" }}
                      >
                        <div
                          className="mx-auto h-full w-[150%] bg-cover bg-center" // Changed from w-[115%] to w-[130%] and added mx-auto
                          style={{
                            backgroundImage: `url(${game.image})`,
                            boxShadow:
                              "inset 0 -20px 30px -10px rgba(0,0,0,0.5)",
                            marginLeft: "-25%", // This helps center the wider image
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}

                  {/* Approval Sticker */}
                  {game.vgdcApproved && (
                    <div className="absolute right-3 top-3 overflow-hidden">
                      <ApprovalSeal color="#debb18ff" className="h-20 w-20" />
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                  {/* Status and Web badges */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full ${game.status ? "bg-green-500" : "bg-yellow-500"} px-3 py-1 text-xs font-medium text-white`}
                    >
                      {getStatusText(game.status)}
                    </span>

                    {game.web && (
                      <span className="rounded-full bg-blue-500 bg-opacity-90 px-3 py-1 text-xs font-medium text-white">
                        Web
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {game.title}
                  </h3>
                </div>

                {/* Click overlay on hover*/}
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-all hover:bg-opacity-20">
                  <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                    <span className="rounded-full bg-background-black px-3 py-2 text-4xl text-white">
                      👁
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {emblaApi?.canScrollPrev() && (
        <button
          className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-70 p-3 text-white transition hover:scale-110 hover:bg-opacity-90 md:left-5"
          onClick={scrollPrev}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {emblaApi?.canScrollNext() && (
        <button
          className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-70 p-3 text-white transition hover:scale-110 hover:bg-opacity-90 md:right-5"
          onClick={scrollNext}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Dots Indicator */}
      {/* <div className="mt-6 flex justify-center gap-2">
        {filteredItems.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition ${
              index === currentIndex ? "bg-vgdc-light-blue" : "bg-gray-600"
            } hover:bg-opacity-80`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  )
}

export default GamesCarousel
