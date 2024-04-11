import Navbar from '@/components/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Image from 'next/image'
import Link from 'next/link'

export default function Officers() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

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
          <Officer
            title="President"
            name="Tyler Roache"
            avatar="/images/officers/2023-2024/TylerRoache.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Co-VP"
            name="Jewelle Tatad"
            avatar="/images/officers/2023-2024/JewelleTatad.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Co-VP"
            name="Joey Soriano"
            avatar="/images/officers/2023-2024/JoeySoriano.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Treasurer"
            name="Chase Peterson"
            avatar="/images/officers/2023-2024/ChasePeterson.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Events Director"
            name="Carey Yoon"
            avatar="/images/officers/2023-2024/CareyYoon.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Marketing Director"
            name="Killian To"
            avatar="/images/officers/2023-2024/KillianTo.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Marketing Officer"
            name="Chanel Lim"
            avatar="/images/officers/2023-2024/ChanelLim.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Marketing Officer"
            name="Olivia Tsui"
            avatar="/images/officers/2023-2024/OliviaTsui.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="3D Art Director"
            name="Rodolfo Marquez-Valencia"
            avatar="/images/officers/2023-2024/RodolfoMarquezValencia.jpg"
            quote="I am now woman (rodolfo)"
          />
          <Officer
            title="Outreach Officer"
            name="Kiichiro Wang"
            avatar="/images/officers/2023-2024/KiichiroWang.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Website Director"
            name="William Kim"
            avatar="/images/officers/2023-2024/WilliamKim.jpg"
            quote="Hi I'm Tyler. I wuv wuv wuv making games uwu"
          />
          <Officer
            title="Public Relations Officer"
            name="Chris Kreins"
            avatar="/images/officers/2023-2024/ChrisKreins.jpg"
            quote="I will murder @jewelle"
          />
        </div>
      </div>
    </main>
  )
}

type OfficerDetails = {
  title: string
  name: string
  avatar: string
  quote: string
}

function Officer({ title, name, avatar, quote }: OfficerDetails) {
  return (
    <div className="w-48">
      {/* Avatar */}
      <Avatar className="mx-8 h-32 w-32">
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <HoverCard>
        <HoverCardTrigger>
          {/* Title and Name */}
          <div className="mx-auto mt-4 cursor-pointer text-center leading-5 transition-all">
            <h3 className="font-bold">{title}</h3>
            <h4>{name}</h4>
          </div>
        </HoverCardTrigger>

        <HoverCardContent className="w-72 border-background-grey bg-background-grey text-white">
          <div className="flex justify-between space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
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
