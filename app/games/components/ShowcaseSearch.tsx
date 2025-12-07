"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import GameModal from "./GameModal"
import GamesGrid from "./GamesGrid"

export default function ShowcaseSearch({
  data,
}: {
  data: ShowcaseGamesDetails[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    web: "all",
    year: "all",
    approved: "all",
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = useMemo(() => {
    if (!data.length) return []

    let result = [...data]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.credits.toLowerCase().includes(term)
      )
    }

    // Filters
    if (filters.status !== "all") {
      const statusValue = filters.status === "true" ? true : false
      result = result.filter((item) => {
        return item.status === statusValue
      })
    }

    if (filters.web !== "all") {
      result = result.filter((item) => item.web === (filters.web === "true"))
    }

    if (filters.approved !== "all") {
      result = result.filter(
        (item) => item.vgdcApproved === (filters.approved === "true")
      )
    }

    if (filters.year !== "all") {
      result = result.filter((item) => {
        if (item.releaseDate === "TBD") return filters.year === "TBD"
        try {
          return (
            new Date(item.releaseDate).getFullYear().toString() === filters.year
          )
        } catch (e) {
          return false
        }
      })
    }

    return result
  }, [searchTerm, filters, data])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentIndex(0)
    setShowModal(false)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentIndex(0)
    setShowModal(false)
  }

  // Handle Escape key for the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal && e.key === "Escape") {
        setShowModal(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showModal])

  // Helper functions
  const getStatusText = (status: boolean) => {
    return status ? "Released" : "In Development"
  }

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      gray: "bg-gray-500",
    }
    return colors[theme] || "bg-gray-500"
  }

  const getYears = () => {
    const years = new Set<string>()
    if (!data) return ["all"]

    data.forEach((item) => {
      if (item.releaseDate === "TBD") {
        years.add("TBD")
      } else {
        try {
          const year = new Date(item.releaseDate).getFullYear().toString()
          if (!isNaN(Number(year))) years.add(year)
        } catch (e) {}
      }
    })
    return ["all", ...Array.from(years).sort()]
  }

  const currentItem = filteredItems[currentIndex]

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="mx-auto max-w-3xl px-4 md:px-12">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full rounded-lg border border-background-grey bg-background-black px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-vgdc-light-blue"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
          </div>

          <button
            className="flex items-center justify-center rounded-lg bg-vgdc-light-blue px-4 py-2 text-white transition-colors hover:bg-opacity-90"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="animate-fadeIn mb-2 grid grid-cols-1 gap-4 rounded-lg border border-background-grey bg-background-black p-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.status}
                onChange={(e) => {
                  handleFilterChange({ ...filters, status: e.target.value })
                  e.target.blur()
                }}
              >
                <option value="all">Any</option>
                <option value="true">Released</option>
                <option value="false">In Development</option>
              </select>
            </div>

            {/* Web Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Platform
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.web}
                onChange={(e) => {
                  handleFilterChange({ ...filters, web: e.target.value })
                  e.target.blur()
                }}
              >
                <option value="all">Any</option>
                <option value="true">Web Available</option>
                <option value="false">Not On Web</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Release Year
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.year}
                onChange={(e) => {
                  handleFilterChange({ ...filters, year: e.target.value })
                  e.target.blur()
                }}
              >
                {getYears().map((year: string) => (
                  <option key={year} value={year}>
                    {year === "all" ? "Any" : year}
                  </option>
                ))}
              </select>
            </div>

            {/* Approved Filter */}
            {/* <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Approval Status
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.approved}
                onChange={(e) => {
                  setFilters({ ...filters, approved: e.target.value })
                  e.target.blur()
                }}
              >
                <option value="all">Any</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div> */}
          </div>
        )}
      </div>

      <GamesGrid
        gameData={filteredItems}
        setCurrentIndex={setCurrentIndex}
        setShowModal={setShowModal}
      />

      {/* Game Modal */}
      {showModal && currentItem && (
        <GameModal
          game={currentItem}
          onClose={() => setShowModal(false)}
          getStatusText={getStatusText}
          getThemeColor={getThemeColor}
        />
      )}
    </div>
  )
}
