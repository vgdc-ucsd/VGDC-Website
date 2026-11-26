"use client"

import { motion } from "framer-motion"

import Socials from "@/components/ui/socials"

import RetroWindowHero from "@/components/homepage/retro-hero/RetroWindowHero"
import SlotMachine from "@/components/homepage/featured-slots/SlotMachine"
import type { ShowcaseGamesDetails } from "@/lib/showcase_games"

/**
 * The hero that appears at the top of the homepage.
 *
 * @returns JSX representation of the hero.
 */
export default function Hero({ games }: { games: ShowcaseGamesDetails[] }) {
  return (
    <section className="mb-32">
      <div className="flex min-h-screen items-center justify-center">
        <RetroWindowHero />
      </div>
      <div id="hero-content" className="px-8 md:px-12">
        <HeroContent games={games} />
      </div>
    </section>
  )
}

function HeroText() {
  return (
    <div className="relative flex h-[40vh] min-h-80 w-full items-center justify-center overflow-hidden md:h-[70vh]">
      <div className="relative block h-fit w-fit">
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -15, left: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, left: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.4, delay: 0 }}
          className="absolute left-0 top-8 w-12 sm:w-20 md:w-28 lg:w-36"
        >
          <Image
            src="/icons/controller.svg"
            alt="Controller icon"
            width={160}
            height={160}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: 15, right: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, right: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="absolute right-0 top-8 w-12 sm:w-20 md:w-28 lg:w-36"
        >
          <Image
            src="/icons/laptop.svg"
            alt="Controller icon"
            width={160}
            height={160}
          />
        </motion.div> */}

        {/* Text & button content */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="mx-0 my-12 max-w-fit sm:my-16 md:mx-8 md:my-24"
        >
          {/* Club Name */}
          <div className="relative">
            <h1
              className="mx-auto block
            text-center font-inter text-5xl font-extrabold tracking-tight text-text-white
            sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <b>
                Video Game
                <br />
                Development
                <br className="sm:hidden" /> Club
              </b>
            </h1>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.05, 1],
              }}
              transition={{
                opacity: { ease: "easeOut", duration: 0.5, delay: 0.3 },
                scale: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.8,
                },
              }}
              className="absolute origin-center
                top-[-2rem] sm:top-[0.5rem] md:top-[1rem] lg:top-[1.5rem]
                -right-[0rem] sm:-right-[4rem] md:-right-[5rem] lg:-right-[8rem]
                [rotate:5deg] sm:[rotate:20deg]"
            >
              <p
                className="text-base text-vgdc-light-blue font-bold sm:text-lg md:text-xl lg:text-3xl"
                style={{
                  fontFamily: "Mojangles, monospace",
                  textShadow: "2px 2px 0px rgba(0, 0, 0, 0.5)",
                }}
              >
                Voted Best Student Org 24-25!
              </p>
            </motion.div>
          </div>
          {/* School Name */}
          <h3 className="mt-2 bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text text-center font-inter text-xl font-semibold tracking-tight text-transparent sm:mt-4 sm:text-2xl md:mt-6 md:text-3xl lg:mt-8 lg:text-4xl">
            @ UC San Diego
          </h3>
          {/* Email Button */}
          {/* <a
        href="mailto:contact@vgdc.dev"
        target="_blank"
        className="text-md mx-auto mt-3 block h-fit w-fit rounded-3xl bg-hot-pink 
          px-3 py-1 text-center align-middle text-white transition-colors hover:bg-pink-700 hover:text-light-grey 
          sm:mt-5"
      >
        contact@vgdc.dev
      </a> */}
        </motion.div>
      </div>
    </div>
  )
}

function HeroContent({ games }: { games: ShowcaseGamesDetails[] }) {
  return (
    <div className="mx-auto h-fit max-w-full md:w-[45rem] lg:w-[60rem] xl:w-[75rem]">
      {/* Hide the whole section when no games have the seal yet */}
      {games.length > 0 && (
        <>
          <FeaturedGamesTitle />
          <SlotMachine games={games} />
        </>
      )}
      <HeroSocials />
    </div>
  )
}

// Big section title, styled like the Mission / Design headings
function FeaturedGamesTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, ease: "easeIn", duration: 0.2 }}
      className="mb-8 text-center text-6xl font-extrabold text-white sm:text-7xl md:whitespace-nowrap lg:mb-10 lg:text-8xl xl:text-9xl"
    >
      Featured <br className="md:hidden" />
      <span className="bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text text-transparent">
        Games
      </span>
    </motion.h1>
  )
}

function HeroSocials() {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 0.8, ease: "easeOut", duration: 0.4 }}
      className="mx-auto mt-8 w-fit md:ml-auto md:mr-0"
    >
      <Socials variant="hero" />
    </motion.div>
  )
}
