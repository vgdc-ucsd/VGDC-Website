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
      <div className="relative h-72 w-full sm:h-96 md:h-[28rem] xl:h-[44rem]">
        <div className="absolute left-0 top-0 w-full">
          <div className="relative mx-auto w-80 sm:w-[28rem] md:w-[32rem] xl:w-[38rem]">
            <Image
              src="/icons/controller.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute left-4 top-16 w-12 sm:w-20 md:top-24 xl:top-36 xl:w-24"
            />

            <Image
              src="/icons/laptop.svg"
              alt="Controller icon"
              width={128}
              height={128}
              className="absolute right-4 top-16 w-12 sm:w-20 md:top-24 xl:top-36 xl:w-24"
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
							sm:mt-32 sm:text-4xl md:mt-40 xl:mt-56 xl:text-5xl"
          >
            <b>
              Video Game
              <br />
              Development Club
            </b>
          </h1>
          {/* School Name */}
          <h3 className="mt-2 text-center font-inter text-lg text-white sm:text-2xl md:text-3xl xl:text-3xl">
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
