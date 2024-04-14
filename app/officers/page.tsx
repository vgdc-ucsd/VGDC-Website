import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Image from 'next/image'
import Link from 'next/link'

// The type for the data for one officer
type OfficerDetails = {
  title: string
  name: string
  avatar: string
  quote: string
}

// List of officers
const officers: OfficerDetails[] = [
  {
    title: 'President',
    name: 'Tyler Roache',
    avatar: '/images/officers/2023-2024/TylerRoache.jpg',
    quote: "Hi I'm Tyler. I wuv wuv wuv making games uwu",
  },
  {
    title: 'Vice President',
    name: 'Jewelle Tatad',
    avatar: '/images/officers/2023-2024/JewelleTatad.jpg',
    quote: "Hi I'm Tyler. I wuv wuv wuv making games uwu",
  },
  {
    title: 'Events Director',
    name: 'Carey Yoon',
    avatar: '/images/officers/2023-2024/CareyYoon.jpg',
    quote: 'why is he not VP???',
  },
  {
    title: 'Treasurer',
    name: 'Chase Peterson',
    avatar: '/images/officers/2023-2024/ChasePeterson.jpg',
    quote: 'I made this page',
  },
  {
    title: 'Marketing Director',
    name: 'Killian To',
    avatar: '/images/officers/2023-2024/KillianTo.jpg',
    quote: 'formerly known as Ben To',
  },
  {
    title: 'Marketing Officer',
    name: 'Chanel Lim',
    avatar: '/images/officers/2023-2024/ChanelLim.jpg',
    quote: 'soon to be projects lead',
  },
  {
    title: 'Marketing Officer',
    name: 'Olivia Tsui',
    avatar: '/images/officers/2023-2024/OliviaTsui.jpg',
    quote: 'i am a marketing officer!',
  },
  {
    title: '3D Art Director',
    name: 'Rodolfo Marquez-Valencia',
    avatar: '/images/officers/2023-2024/RodolfoMarquezValencia.jpg',
    quote: 'I am now woman (rodolfo)',
  },
  {
    title: 'Outreach Officer',
    name: 'Kiichiro Wang',
    avatar: '/images/officers/2023-2024/KiichiroWang.jpg',
    quote: 'the next president!',
  },
  {
    title: 'Website Director',
    name: 'William Kim',
    avatar: '/images/officers/2023-2024/WilliamKim.jpg',
    quote: 'I made some other pages!',
  },
  {
    title: 'Public Relations Officer',
    name: 'Chris Kreins',
    avatar: '/images/officers/2023-2024/ChrisKreins.jpg',
    quote: 'I will murder @jewelle',
  },
  {
    title: 'General Officer',
    name: 'Joey Soriano',
    avatar: '/images/officers/2023-2024/JoeySoriano.jpg',
    quote: 'formerly Co-VP',
  },
]

/**
 * Content for the officers page.
 *
 * @returns JSX representation of the officers page.
 */
export default function Officers() {
  return (
    <main className="min-h-screen bg-background-black">
      {/* Display the navbar at the top of the page */}
      <Navbar />

      {/* Page content */}
      <div className="mx-auto max-w-[920px] pb-20 text-white">
        {/* Title section */}
        <div className="mx-6 mb-20 mt-20">
          <Link
            href="./"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back to home`}</Link>
          <h2 className="mb-3 mt-2 text-4xl font-bold">Our Team</h2>
          <p className="max-w-[600px] text-lg">
            We're a growing body of talented individuals with a passion for
            making game development exciting in every way. Hover over each
            profile!
          </p>
        </div>

        {/* Officers */}
        <div className="flex-start flex flex-wrap justify-center gap-12">
          {officers.map((officer, index) => {
            return <Officer key={index} {...officer} />
          })}
        </div>
      </div>

      <Footer />
    </main>
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
        <AvatarImage src={avatar} />
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
              <p className="text-sm font-normal">{quote}</p>
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
