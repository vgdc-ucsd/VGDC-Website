import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from "next/image"

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
    <div className="flex-start flex flex-wrap justify-center gap-12">
      {officers.map((officer, index) => {
        return <Officer key={index} {...officer} />
      })}
    </div>
  )
}

/**
 * A component representing one officer.
 *
 * @param officer The object for one officer with a title, name, avatar, and quote.
 * @returns The JSX representation of an officer.
 */
function Officer({ title, name, avatar, quote }: OfficerDetails) {
  return (
    <div className="w-48">
      {/* Avatar */}
      <Avatar className="mx-8 h-32 w-32">
        {avatar && (
          <Image
            src={avatar}
            width={300}
            height={300}
            alt={`Image of ${name}`}
          />
        )}
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      {/* The hover card over the title and name */}
      <HoverCard>
        <HoverCardTrigger>
          {/* Title and Name */}
          <div className="mx-auto mt-4 cursor-pointer text-center leading-5 transition-all">
            <h3 className="font-bold">{title}</h3>
            <h4>{name}</h4>
          </div>
        </HoverCardTrigger>

        {/* Hover card content */}
        <HoverCardContent className="w-72 border-background-grey bg-background-grey text-white">
          <div className="flex justify-between space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-1">
              <h4 className="text-sm font-semibold">{name}</h4>
              <p className="text-xs font-normal">{quote}</p>
              <div className="flex items-center pt-2">
                <Image
                  src="/icons/controller.svg"
                  alt="Controller icon"
                  width={20}
                  height={20}
                  className="h-6 w-6 text-white"
                />
                <span className="ml-2 text-sm">{title}</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
