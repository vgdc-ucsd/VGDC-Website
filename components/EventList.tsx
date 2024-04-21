"use client"

import Link from "next/link"

export default function EventList() {
  return (
    <div className="mx-auto mb-32 mt-32 w-full px-4 sm:w-[600px] sm:px-8 md:w-[680px] lg:w-[800px]">
      <div className="mb-6 text-left">
        <h2 className="mb-2 text-xl font-bold text-white lg:text-3xl">
          Explore Events
        </h2>
        <Link
          href="./"
          className="text-text-grey transition-all hover:text-white"
        >{`View more events ->`}</Link>
      </div>
      <div className="space-y-6">
        <Event
          title="Love Yourself Social"
          location="Triton Esports Center (TEC)"
          timestamp="Tuesday, 5/17"
          description="Viverra nam libero justo laoreet sit amet cursus. Nulla porttitor
          massa id neque aliquam. egestas. Libero justo laoreet sit amet cursus
          sit amet dictum sit. Viverra nam libero justo laoreet sit amet cursus.
          Nulla porttitor massa id neque aliquam. egestas. Libero justo laoreet
          sit amet cursus sit amet dictum sit."
        />
        <Event
          title="Love Yourself Social"
          location="Triton Esports Center (TEC)"
          timestamp="Tuesday, 5/17"
          description="Viverra nam libero justo laoreet sit amet cursus. Nulla porttitor
          massa id neque aliquam. egestas. Libero justo laoreet sit amet cursus
          sit amet dictum sit. Viverra nam libero justo laoreet sit amet cursus.
          Nulla porttitor massa id neque aliquam. egestas. Libero justo laoreet
          sit amet cursus sit amet dictum sit."
        />
        <Event
          title="Love Yourself Social"
          location="Triton Esports Center (TEC)"
          timestamp="Tuesday, 5/17"
          description="Viverra nam libero justo laoreet sit amet cursus. Nulla porttitor
          massa id neque aliquam. egestas. Libero justo laoreet sit amet cursus
          sit amet dictum sit. Viverra nam libero justo laoreet sit amet cursus.
          Nulla porttitor massa id neque aliquam. egestas. Libero justo laoreet
          sit amet cursus sit amet dictum sit."
        />
      </div>
    </div>
  )
}

function Event({ title, location, timestamp, description }: any) {
  return (
    <div className="flex rounded-3xl bg-footer-grey p-3 align-middle sm:space-x-6 sm:p-6">
      <img
        src="./images/events/lys-poster.jpg"
        className="hidden w-40 rounded-xl sm:block md:w-48"
      />
      <div className="relative w-full">
        <div className="mb-2 md:mt-2">
          <h3 className="text-xl font-semibold text-text-white">{title}</h3>
          <h4 className="text-md font-semibold text-vgdc-light-green">
            {location}
          </h4>
          <h4 className="text-md font-semibold text-vgdc-light-green md:hidden">
            {timestamp}
          </h4>
        </div>
        <p className="hidden w-full text-sm text-text-grey sm:block md:hidden">
          {truncate(description, 120, true)}
        </p>
        <p className="w-full text-sm text-text-grey sm:hidden md:block md:w-80 lg:w-96">
          {truncate(description, 280, true)}
        </p>
        <h4 className="invisible absolute right-2 font-semibold text-text-grey md:visible md:top-2">
          {timestamp}
        </h4>
        <button className="bottom-0 right-0 mt-4 h-10 w-28 rounded-lg bg-background-grey text-sm text-text-white transition-colors sm:absolute sm:right-auto md:bottom-2">
          Event Details
        </button>
      </div>
    </div>
  )
}

function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str
  }
  const subString = str.slice(0, n - 1) // the original check
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "..."
  )
}
