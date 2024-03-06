import Navbar from '@/components/Navbar'
import EventList from '@/components/EventList'
import Contributors from '@/components/Contributors'
import Footer from '@/components/Footer'
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

function Hero() {
  return (
    <>
      {/* The full container */}
      <div className="relative h-72 w-full sm:h-96 xl:h-[36rem]">
        <div className="absolute left-0 top-0 w-full">
          <div className="relative mx-auto w-80 sm:w-[36rem] md:w-[44rem] xl:w-[68rem]">
            <Image
              src="/icons/controller.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute left-4 top-16 w-12 sm:w-20 md:top-24 md:w-24 xl:w-40"
            />

            <Image
              src="/icons/laptop.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute right-4 top-16 w-12 sm:w-20 md:top-24 md:w-24 xl:w-40"
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
							sm:mt-32 sm:text-5xl md:mt-40 md:text-6xl xl:mt-56 xl:text-8xl"
          >
            <b>
              Video Game
              <br />
              Development Club
            </b>
          </h1>
          {/* School Name */}
          <h3 className="mt-2 text-center font-inter text-lg text-white sm:text-2xl md:text-3xl xl:mt-8 xl:text-5xl">
            @ UC San Diego
          </h3>
          {/* Email Button */}
          <a
            href="mailto:vgdc@ucsd.edu"
            target="_blank"
            className="text-md mx-auto mt-3 block h-7 w-36 rounded-3xl bg-hot-pink text-center align-middle 
							text-white transition-colors hover:bg-pink-700 hover:text-light-grey sm:mt-5 sm:h-9 sm:w-40 sm:pt-1 sm:text-lg
							xl:mt-8 xl:h-12 xl:w-56 xl:pt-2 xl:text-2xl"
          >
            vgdc@ucsd.edu
          </a>
        </div>
      </div>
    </>
  )
}

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
      <div className="h-96 w-full">
        <h4 className="mt-8 text-center font-inter text-lg text-text-grey sm:text-xl md:mt-20 md:text-2xl">
          Top companies our alumni work at
        </h4>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-4 w-48 sm:w-96 md:w-[36rem] xl:w-[64rem]"
        >
          <CarouselPrevious />
          <CarouselContent>
            {companies.map((company) => {
              return (
                <CarouselItem className={carouselStyle}>
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
  return <></>
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
