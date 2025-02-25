"use client"

import React, { useEffect, useRef } from "react"
import { ShowcaseItem } from "@/lib/showcase"
import Image from "next/image"
import { X, ExternalLink, Calendar, Users, Code } from "lucide-react"

type GameModalProps = {
  game: ShowcaseItem
  onClose: () => void
  getStatusText: (status: boolean | number) => string
  getThemeColor: (theme: string) => string
}

const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  getStatusText,
  getThemeColor,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling of background content
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-12">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-background-black shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
        >
          <X size={20} />
        </button>

        {/* Hide scrollbar */}
        <style jsx global>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>

        <div className="hide-scrollbar max-h-[90vh] overflow-y-auto">
          {/* Blurred background image header */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-800 sm:h-48">
            {game.image ? (
              <>
                {/* Blurred background image */}
                <div
                  className="absolute inset-0 scale-110"
                  style={{
                    backgroundImage: `url(${game.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(15px)",
                  }}
                />

                {/* Overlay to darken the blurred image */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                {/* General info section (image, title, and approval seal) */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-black p-6">
                  <div className="flex items-end gap-4">
                    {/* Clear image */}
                    <div
                      className="relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg"
                      style={{ maxWidth: "150px", maxHeight: "200px" }}
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        width={150}
                        height={200}
                        className="h-auto w-auto object-contain"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>

                    {/* Content container that keeps title, seal and badges aligned at the bottom */}
                    <div className="flex-grow pb-1">
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Title and badges container */}
                          <div className="mb-2 flex items-center gap-2">
                            {/* Title */}
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                              {game.title}
                            </h2>
                          </div>

                          {/* Badges under the title */}
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getThemeColor(game.theme)}`}
                            >
                              {game.theme || "General"}
                            </span>
                            <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-white">
                              {getStatusText(game.status)}
                            </span>
                            {game.web && (
                              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                                Web
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Approval Seal moved to the right, centered vertically */}
                        {game.approved && (
                          <div className="ml-4 h-12 w-12 flex-shrink-0 sm:h-14 sm:w-14">
                            <svg
                              viewBox="0 0 100 100"
                              className="h-full w-full drop-shadow-lg"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="white"
                                stroke="#0047AB"
                                strokeWidth="4"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="#0047AB"
                                strokeWidth="2"
                              />
                              <text
                                x="50"
                                y="40"
                                fontSize="14"
                                fontWeight="bold"
                                fill="#0047AB"
                                textAnchor="middle"
                              >
                                OFFICIAL
                              </text>
                              <text
                                x="50"
                                y="55"
                                fontSize="12"
                                fontWeight="bold"
                                fill="#0047AB"
                                textAnchor="middle"
                              >
                                VGDC
                              </text>
                              <text
                                x="50"
                                y="70"
                                fontSize="15"
                                fontWeight="bold"
                                fill="#0047AB"
                                textAnchor="middle"
                              >
                                APPROVED
                              </text>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-800">
                <p className="text-gray-400">No image available</p>
              </div>
            )}
          </div>

          {/* Game details */}
          <div className="p-6">
            {/* Info panel */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-background-grey bg-opacity-20 p-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Calendar className="flex-shrink-0 text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-400">Released</p>
                  <p className="text-white">{game.released}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Code className="flex-shrink-0 text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Difficulty
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`mr-1 text-lg ${
                          i < game.difficulty
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="flex-shrink-0 text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-400">Team</p>
                  <p className="break-words text-white">{game.credits}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Description
              </h3>
              <p className="whitespace-pre-line text-gray-300">
                {game.description}
              </p>
            </div>

            {/* Action button */}
            {game.link && (
              <div className="flex justify-center">
                <a
                  href={game.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-vgdc-light-blue px-6 py-3 text-center font-medium text-white transition hover:bg-opacity-90"
                >
                  ▶ Play Game
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameModal
