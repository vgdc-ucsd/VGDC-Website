import Navbar from '@/components/Navbar'
import EventList from '@/components/EventList'
import Contributors from '@/components/Contributors'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useSpring, animated } from 'react-spring'

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
      <div className="relative h-96 w-full">
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
  return <></>
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
