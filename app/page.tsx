import Navbar from '@/components/Navbar'
import EventList from '@/components/EventList'
import Contributors from '@/components/Contributors'
import Footer from '@/components/Footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaInstagram, FaDiscord, FaFacebook } from 'react-icons/fa'
import { SiMinutemailer } from 'react-icons/si'
import Image from 'next/image'
import { useSpring, animated } from 'react-spring'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <Hero />
      <Companies />
      <About />
      <Engagement />
      <Niches />
      <Games />
      <Footer />
    </main>
  )
}

/**
 * The hero that appears at the top of the homepage.
 *
 * @returns JSX representation of the hero.
 */
function Hero() {
  return (
    <>
      {/* The full container */}
      <div className="relative h-72 w-full sm:h-96 md:h-[26rem] xl:h-[36rem]">
        <div className="absolute left-0 top-0 w-full">
          <div className="relative mx-auto w-80 sm:w-[28rem] md:w-[32rem] xl:w-[64rem]">
            <Image
              src="/icons/controller.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute left-4 top-16 w-12 sm:w-20 md:top-24 xl:w-36"
            />

            <Image
              src="/icons/laptop.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute right-4 top-16 w-12 sm:w-20 md:top-24 xl:w-36"
            />
          </div>
        </div>
        {/* Text & button content */}
        <div className="mx-auto w-fit">
          {/* Club Name */}
          <h1
            className="mt-24 inline-block
							bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text 
							text-center font-inter text-3xl font-extrabold text-transparent
							sm:mt-40 sm:text-4xl xl:text-8xl"
          >
            <b>
              Video Game
              <br />
              Development Club
            </b>
          </h1>
          {/* School Name */}
          <h3 className="mt-4 text-center font-inter text-lg text-white sm:text-2xl md:text-3xl xl:text-3xl">
            @ UC San Diego
          </h3>
          {/* Email Button */}
          <a
            href="mailto:vgdc@ucsd.edu"
            target="_blank"
            className="text-md mx-auto mt-3 block h-fit w-fit rounded-3xl bg-hot-pink 
							px-3 py-1 text-center align-middle text-white transition-colors hover:bg-pink-700 hover:text-light-grey 
							sm:mt-5"
          >
            vgdc@ucsd.edu
          </a>
        </div>
      </div>
    </>
  )
}

/**
 *
 * @returns
 */
function Companies() {
  const carouselStyle = 'basis-1/2 sm:basis-1/3 xl:basis-1/4'
  const companyLogoStyle = 'mx-auto w-28 sm:w-36 md:w-40 xl:w-48'

  // List of companies & data to be shown in the carousel
  const companies = [
    {
      name: 'XBOX Game Studios',
      logo: '/logos/companies/xbox-game-studios.png',
      link: 'https://www.xbox.com/xbox-game-studios',
    },
    {
      name: 'Playstation',
      logo: '/logos/companies/playstation.png',
      link: 'https://www.playstation.com/',
    },
    {
      name: 'Google',
      logo: '/logos/companies/google.png',
      link: 'https://about.google/',
    },
    {
      name: 'Blizzard Entertainment',
      logo: '/logos/companies/blizzard.png',
      link: 'https://www.blizzard.com/',
    },
    {
      name: 'Supergiant Games',
      logo: '/logos/companies/supergiant.png',
      link: 'https://www.supergiantgames.com/',
    },
    {
      name: 'The Behemoth',
      logo: '/logos/companies/behemoth.png',
      link: 'https://www.thebehemoth.com/',
    },
  ]

  return (
    <>
      <div className="h-40 w-full sm:h-48 md:h-56 xl:h-80">
        {/* Text above carousel */}
        <h4 className="pt-8 text-center font-inter text-lg text-text-grey sm:text-xl md:text-xl">
          Top companies our alumni work at
        </h4>
        {/* List of companies */}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-4 w-48 sm:w-96 md:w-[36rem] xl:w-[64rem]"
        >
          <CarouselPrevious />
          <CarouselContent>
            {/* Iterate through all the companies in the array to populate carousel */}
            {companies.map((company, index) => {
              return (
                <CarouselItem className={carouselStyle} key={index}>
                  <a href={company.link} target="_blank">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={500}
                      height={500}
                      className={companyLogoStyle}
                    />
                  </a>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </>
  )
}

function About() {
  const socialLinkStyle =
    'text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink'

  return (
    <section className="mx-4 flex w-auto flex-col items-center py-12">
      <h2 className=" text-md font-bold text-white md:text-xl lg:text-3xl">
        What is VGDC?
      </h2>

      <div className="mt-4 flex flex-col items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>TR</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <p className="mt-2 text-base font-bold text-white">President</p>
          <p className="text-base text-white">Tyler Roache</p>
          <p className="my-0 mt-3 max-w-md text-xs text-text-grey md:text-lg">
            VGDC is a student-run organization at UCSD dedicated to teaching and
            applying software and artistic skills widely used in the video game
            industry.
          </p>
        </div>

        <span className="align-center mt-4 flex w-56 flex-row justify-between">
          <a href="https://www.instagram.com/vgdc.ucsd/" target="_blank">
            <FaInstagram className={socialLinkStyle} size={32} />
          </a>
          <a href="https://bit.ly/VGDCUCSD" target="_blank">
            <FaDiscord className={socialLinkStyle} size={32} />
          </a>
          <a href="https://www.facebook.com/groups/VGDC.UCSD/" target="_blank">
            <FaFacebook className={socialLinkStyle} size={28} />
          </a>
          <a href="mailto:vgdc@ucsd.edu" target="_blank">
            <SiMinutemailer className={socialLinkStyle} size={28} />
          </a>
        </span>
      </div>
    </section>
  )
}

function Engagement() {
  return <></>
}

function Niches() {
  return <></>
}

function Games() {
  return <></>
}
