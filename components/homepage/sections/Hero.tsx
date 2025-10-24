"use client"

import { motion } from "framer-motion"

import Image from "next/image"

import Socials from "@/components/ui/socials"

import React from "react"
import UseEmblaCarousel from "embla-carousel-react"
import heroGames from "@/public/data/hero_games.json"

/**
 * The hero that appears at the top of the homepage.
 *
 * @returns JSX representation of the hero.
 */
export default function Hero() {
  return (
    <section className="mb-32">
      <HeroText />
      <HeroContent />
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
        href="mailto:vgdc@ucsd.edu"
        target="_blank"
        className="text-md mx-auto mt-3 block h-fit w-fit rounded-3xl bg-hot-pink 
          px-3 py-1 text-center align-middle text-white transition-colors hover:bg-pink-700 hover:text-light-grey 
          sm:mt-5"
      >
        vgdc@ucsd.edu
      </a> */}
        </motion.div>
      </div>
    </div>
  )
}

function HeroContent() {
  return (
    <div className="mx-auto h-fit md:w-[45rem] lg:w-[60rem] xl:w-[75rem]">
      <HeroGames />
      <HeroSocials />
    </div>
  )
}

// The type for the data for one hero game
export type HeroGameDetails = {
  name: string
  link: string
  image: string
  year: string
  style: string
  paragraph: string
  order: number
}

function HeroGames() {
  const heroGamesList: HeroGameDetails[] = heroGames.hero_games.map((game) => ({
    name: game.name!,
    link: game.link!,
    image: game.image!,
    year: game.year!,
    style: game.style!,
    paragraph: game.paragraph!,
    order: game.order!,
  }))

  const [emblaRef, embla] = UseEmblaCarousel({ loop: true })

  const emblaStyle = "overflow-hidden md:hidden mb-16"
  const emblaContainerStyle = "flex"
  const emblaSlideStyle =
    "min-w-0 flex-grow-0 flex-shrink-0 basis-3/4 min-[450px]:basis-1/2 text-text-white w-40 mx-2 min-[450px]:mx-4 select-none"

  function EmblaSlide({
    name,
    link,
    image,
    year,
  }: {
    name: string
    link: string
    image: string
    year: string
  }) {
    return (
      <a href={link} target="_blank" className={emblaSlideStyle}>
        <Image
          className="aspect-[10/9] w-full rounded-xl object-cover"
          src={image}
          width={0}
          height={0}
          sizes="100vw"
          alt={`Image of ${name}`}
        />
        <div className="relative mx-2 mt-2 block h-6 text-lg sm:mx-3 sm:mt-3 sm:text-xl">
          <h3 className="absolute font-semibold text-text-white">{name}</h3>
          <p className="absolute right-0 font-semibold text-hot-pink">{year}</p>
        </div>
      </a>
    )
  }

  return (
    <>
      {/* Mobile version */}
      <motion.div
        initial={{ opacity: 0, translateY: 50 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, ease: "easeOut", duration: 0.4 }}
        className={emblaStyle}
        ref={emblaRef}
      >
        <div className={emblaContainerStyle}>
          {heroGamesList.map((game, index) => {
            return (
              <EmblaSlide
                key={index}
                name={game.name}
                link={game.link}
                image={game.image}
                year={game.year}
              />
            )
          })}
        </div>
      </motion.div>
      {/* Desktop/tablet version */}
      <div className="hidden aspect-square h-fit grid-cols-4 grid-rows-4 gap-2 md:grid lg:gap-4">
        {heroGamesList.map((game, index) => {
          return (
            <Game
              key={index}
              style={game.style}
              name={game.name}
              link={game.link}
              paragraph={game.paragraph}
              image={game.image}
              order={game.order}
            />
          )
        })}
      </div>
    </>
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

function Game({
  style,
  name,
  link,
  paragraph,
  image,
  order,
}: {
  style: string // "small-block" | "long-block" | "big-block"
  name: string
  link: string
  paragraph?: string
  image: string
  order: number
}) {
  const gameStyle = "relative rounded-xl border border-gray-700 overflow-clip"
  const headerStyle =
    "text-md font-semibold text-text-white md:text-xl xl:text-2xl tracking-tight"
  const paragraphStyle =
    "text-sm w-full xl:w-[70%] text-text-grey lg:text-base leading-4 lg:leading-5 xl:leading-6"

  if (style == "small-block") {
    return (
      <motion.a
        initial={{ opacity: 0, translateY: 50 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: order * 0.05, ease: "easeOut", duration: 0.4 }}
        href={link}
        target="_blank"
        className={`${gameStyle} group col-span-1 row-span-1`}
      >
        <div className="absolute h-full w-full bg-black opacity-40 transition-opacity group-hover:opacity-0" />
        <div
          className={`${headerStyle} absolute bottom-2 left-2 select-none transition-[bottom] group-hover:-bottom-12 lg:bottom-3 lg:left-3 xl:bottom-4 xl:left-4`}
        >
          {name}
        </div>
        <Image
          src={image}
          alt={`Image of ${name}`}
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </motion.a>
    )
  }

  if (style == "long-block") {
    return (
      <motion.div
        initial={{ opacity: 0, translateY: 50 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: order * 0.05, ease: "easeOut", duration: 0.4 }}
        className={`${gameStyle} group col-span-2 row-span-1`}
      >
        <div className="flex h-[50%] flex-col justify-center p-2 align-middle lg:p-3 xl:h-[40%] xl:p-4">
          <div className="h-fit">
            <a href={link} target="_blank" className={headerStyle}>
              {name}
            </a>
            <p className={paragraphStyle}>{paragraph}</p>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          className="absolute bottom-0 h-[50%] w-full xl:h-[60%]"
        >
          <div className="absolute h-full w-full bg-black opacity-20 transition-opacity hover:opacity-0" />
          <Image
            src={image}
            alt={`Image of ${name}`}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </a>
      </motion.div>
    )
  }

  if (style == "big-block") {
    return (
      <motion.div
        initial={{ opacity: 0, translateY: 50 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: order * 0.05, ease: "easeOut", duration: 0.4 }}
        className={`${gameStyle} group col-span-2 row-span-2`}
      >
        <div className="flex h-[30%] flex-col justify-center p-2 align-middle lg:p-3 xl:p-4">
          <div className="h-fit">
            <a href={link} target="_blank" className={headerStyle}>
              {name}
            </a>
            <p className={paragraphStyle}>
              {paragraph}
              <a
                href={link}
                target="_blank"
                className="hidden w-fit font-bold text-hot-pink lg:block xl:pt-1"
              >
                {"Learn more ->"}
              </a>
            </p>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          className="absolute bottom-0 h-[70%] w-full"
        >
          <div className="absolute h-full w-full bg-black opacity-20 transition-opacity hover:opacity-0" />
          <Image
            src={image}
            alt={`Image of ${name}`}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </a>
      </motion.div>
    )
  }

  return <div className={`${gameStyle}`}></div>
}
