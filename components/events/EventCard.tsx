"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import removeMd from "remove-markdown"

/** An event card to be shown in the events list. */
export default function EventCard({
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
      whileHover={{ filter: "brightness(0.8)" }}
    >
    <Link href={`./events/${slug}`}>
      <motion.div
        initial={{ opacity: 0, translateY: 100 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        className="flex rounded-3xl bg-background-grey/50 p-5 align-middle sm:space-x-6 sm:p-6 mb-6"
      >
        <img
          src={`${image}`}
          className="hidden aspect-square w-40 rounded-xl object-cover sm:block md:w-48"
        />
        <div className="relative w-full">
          <div className="mb-1 md:mt-2">
              <h3 className="text-xl font-semibold text-text-white">{title}</h3>
              <h4 className="text-md font-semibold text-vgdc-light-green">
                {location}
              </h4>
              <h4 className="text-md font-semibold text-vgdc-light-green lg:hidden">
                {date} @ {time}
              </h4>
            </div>
            <p className="hidden w-full text-sm text-text-grey sm:block md:hidden">
              {truncate(removeMd(description), 260, true)}
            </p>
            <p className="w-full text-sm text-text-grey sm:hidden md:block lg:bottom-5 lg:w-[440px] lg:leading-6">
              {truncate(removeMd(description), 320, true)}
            </p>
            <h4 className="invisible absolute right-2 text-right font-semibold text-text-grey lg:visible lg:top-2">
              {date}
              <br />
              {time}
            </h4>
          </div>
        
      </motion.div>
    </Link>
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
