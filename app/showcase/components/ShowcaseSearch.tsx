"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { ShowcaseData } from "@/lib/showcase"
import GamesCarousel from "./GamesCarousel"
import GameModal from "./GameModal"

export default function ShowcaseCarousel({ data }: { data: ShowcaseData }) {
  const [filteredItems, setFilteredItems] = useState(data.showcase || [])
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

  // Filters and search
  useEffect(() => {
    if (!data?.showcase?.length) return

    let result = [...data.showcase]

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
        if (typeof item.status === "boolean") return item.status === statusValue
        return filters.status === "true" ? item.status === 1 : item.status === 0
      })
    }

    if (filters.web !== "all") {
      result = result.filter((item) => item.web === (filters.web === "true"))
    }

    if (filters.approved !== "all") {
      result = result.filter(
        (item) => item.approved === (filters.approved === "true")
      )
    }

    if (filters.year !== "all") {
      result = result.filter((item) => {
        if (item.released === "TBD") return filters.year === "TBD"
        try {
          return (
            new Date(item.released).getFullYear().toString() === filters.year
          )
        } catch (e) {
          return false
        }
      })
    }

    setFilteredItems(result)
    if (result.length > 0) {
      setCurrentIndex(0)
      setShowModal(false)
    }
  }, [searchTerm, filters, data?.showcase])

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
  const getStatusText = (status: boolean | number) =>
    typeof status === "boolean"
      ? status
        ? "Released"
        : "In Development"
      : status === 1
        ? "Released"
        : "In Development"

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
    if (!data?.showcase) return ["all"]

    data.showcase.forEach((item) => {
      if (item.released === "TBD") {
        years.add("TBD")
      } else {
        try {
          const year = new Date(item.released).getFullYear().toString()
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
      <div className="mb-6 px-4 max-w-3xl mx-auto md:px-12">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full rounded-lg border border-background-grey bg-background-black px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-vgdc-light-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="animate-fadeIn grid grid-cols-1 gap-4 rounded-lg border border-background-grey bg-background-black p-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Statuses</option>
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
                onChange={(e) =>
                  setFilters({ ...filters, web: e.target.value })
                }
              >
                <option value="all">All Platforms</option>
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
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                {getYears().map((year) => (
                  <option key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </option>
                ))}
              </select>
            </div>

            {/* Approved Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Approval Status
              </label>
              <select
                className="w-full rounded-md border border-background-grey bg-background-black p-2 text-white focus:outline-none"
                value={filters.approved}
                onChange={(e) =>
                  setFilters({ ...filters, approved: e.target.value })
                }
              >
                <option value="all">All Games</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-3 text-center">
        <p className="text-sm text-gray-400">
          {`Showing ${filteredItems.length} of ${data.showcase?.length || 0} games`}
        </p>
        <p className="text-sm text-gray-500">
          {`← Enter →`}
        </p>
      </div>

      {/* Embla Carousel */}
      <GamesCarousel
        filteredItems={filteredItems}
        currentIndex={currentIndex}
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