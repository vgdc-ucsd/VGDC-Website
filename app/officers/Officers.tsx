"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from "next/image"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"

// The type for the data for one officer
export type OfficerDetails = {
  title: string
  name: string
  avatar: string
  quote: string
}

export default function Officers({ officers }: { officers: OfficerDetails[] }) {
  {
    /* Officers */
  }
  return (
    <div className="flex-start flex flex-wrap justify-center gap-12 text-text-white">
      {officers.map((officer, index) => {
        return <Officer key={index} officer={officer} order={index} />
      })}
    </div>
  )
}

function OfficerAvatar({ officer }: { officer: OfficerDetails }) {
  return <>
    {/* Avatar, Title, and Name */}
    {/* Avatar */}
    <Avatar className="group mx-auto cursor-pointer h-32 w-32">
      {officer.avatar && (
        <Image
          src={officer.avatar}
          width={300}
          height={300}
          alt={`Image of ${officer.name}`}
        />
      )}
      <AvatarFallback>{officer.name[0]}</AvatarFallback>
    </Avatar>
    <div className="mx-auto mt-4 cursor-pointer text-center leading-5 transition-all">
      <h3 className="font-bold">{officer.title}</h3>
      <h4>{officer.name}</h4>
    </div>
  </>
}

function OfficerBioCard({ officer }: { officer: OfficerDetails }) {
  return (
    <div className="flex justify-between space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={officer.avatar} />
        <AvatarFallback>{officer.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow space-y-1">
        <h4 className="text-sm font-semibold">{officer.name}</h4>
        <p className="text-xs font-normal">{officer.quote}</p>
        <div className="flex items-center pt-2">
          <Image
            src="/icons/controller.svg"
            alt="Controller icon"
            width={20}
            height={20}
            className="h-6 w-6 text-white"
          />
          <span className="ml-2 text-sm">{officer.title}</span>
        </div>
      </div>
    </div>
  )
}

function OfficerAnim( { order, children }: { order: number, children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: "100vh" }}
      animate={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.08 * order,
        ease: "easeOut",
        duration: 0.6,
      }}
      className="w-44"
    >
      {children}
    </motion.div>
  )
}

/**
 * A component representing one officer.
 *
 * @param officer The object for one officer with a title, name, avatar, and quote.
 * @returns The JSX representation of an officer.
 */
function Officer({
  officer,
  order,
}: {
  officer: OfficerDetails
  order: number
}) {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  if (isMobile) return (
    <OfficerAnim order={order}>
      {/* The hover card over the title and name */}
      <Popover>
        <PopoverTrigger>
          <OfficerAvatar officer={officer} />
        </PopoverTrigger>

        {/* The hover card over the title and name */}
        <PopoverContent className="w-72 border-background-grey bg-background-grey text-white rounded-md z-50 p-4 animate-in fade-in-0 data-[state-closed]:animate-out">
          <OfficerBioCard officer={officer} />
        </PopoverContent>
      </Popover>
    </OfficerAnim>
  )

  return (
    <OfficerAnim order={order}>
      {/* The hover card over the title and name */}
      <HoverCard openDelay={0.3} closeDelay={0.3}>
        <HoverCardTrigger>
          <OfficerAvatar officer={officer} />
        </HoverCardTrigger>

        {/* Hover card content */}
        <HoverCardContent className="w-72 border-background-grey bg-background-grey text-white">
          <OfficerBioCard officer={officer} />
        </HoverCardContent>
      </HoverCard>
    </OfficerAnim>
  )
}
