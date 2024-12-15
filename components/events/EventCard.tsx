"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

/** An event card to be shown in the events list. */
export default function Event({
  title,
  location,
  date,
  time,
  description,
  image,
  slug,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, translateX: -60 }}
      whileInView={{ opacity: 1, scale: 1, translateX: 0 }}
      viewport={{ once: true }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="flex rounded-3xl bg-background-grey/50 p-5 align-middle sm:space-x-6 sm:p-6"
    >
      <img
        src={`${image}`}
        className="hidden w-40 rounded-xl sm:block md:w-48 aspect-square object-cover"
      />
      <div className="relative w-full">
        <div className="mb-2 md:mt-2">
          <Link href={`./events/${slug}`}>
            <h3 className="text-xl font-semibold text-text-white">{title}</h3>
          </Link>
          <h4 className="text-md font-semibold text-vgdc-light-green">
            {location}
          </h4>
          <h4 className="text-md font-semibold text-vgdc-light-green lg:hidden">
            {date} @ {time}
          </h4>
        </div>
        <p className="hidden w-full text-sm text-text-grey sm:block md:hidden">
          {truncate(description, 120, true)}
        </p>
        <p className="w-full text-sm text-text-grey sm:hidden md:block md:w-80 lg:w-[440px] lg:leading-6">
          {truncate(description, 180, true)}
        </p>
        <h4 className="invisible absolute right-2 text-right font-semibold text-text-grey lg:visible lg:top-2">
          {date}
          <br />
          {time}
        </h4>
        <Link href={`./events/${slug}`}>
          <button className="bottom-0 right-0 mt-4 h-10 w-28 rounded-lg bg-background-grey text-sm text-text-white transition-colors sm:absolute sm:right-auto md:bottom-2">
            Event Details
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

/** Returns a shortened version of a given string. */
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
