"use client"

import { motion } from "framer-motion"

import Image from "next/image"

import { SiMinutemailer } from "react-icons/si"
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa"

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
    <div className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden pt-16">
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
          initial={{ opacity: 0, translateY: 50 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="mx-0 my-12 max-w-fit sm:my-16 md:mx-8 md:my-24"
        >
          {/* Club Name */}
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
    <div className="mx-auto h-fit w-[1200px]">
      <HeroGames />
      <HeroSocials />
    </div>
  )
}

function HeroGames() {
  return (
    <div className="grid aspect-square h-fit grid-cols-4 grid-rows-4 gap-4">
      <Game
        style="big-block"
        name="Patrick's Parabox"
        link="https://www.indiecade.com/patricks-parabox/"
        paragraph="An award-winning recursive puzzle game developed by Patrick Traynor."
        image="/images/games/patricksparabox.png"
      />
      <Game
        style="long-block"
        name="Contract Killer"
        paragraph="An action-packed 2D beat-em-up with single-player or co-op modes."
        link="https://store.steampowered.com/app/1588250/Contract_Killer/"
        image="/images/games/contractkiller.jpg"
      />
      <Game
        style="small-block"
        name="Sky Limit"
        link="https://creikey.itch.io/skylimit"
        image="/images/games/skylimit.png"
      />
      <Game
        style="small-block"
        name="Spellthief"
        link="https://chaseplays.itch.io/spellthief"
        image="/images/games/spellthief.png"
      />
      <Game
        style="small-block"
        name="Lamplight"
        link="https://angelina007.itch.io/lamplight"
        image="/images/games/lamplight.png"
      />
      <Game
        style="small-block"
        name="Takyon"
        link="https://wabadaba.itch.io/takyon"
        image="/images/games/takyon.jpg"
      />
      <Game
        style="big-block"
        name="Athanaeum"
        paragraph="Our club's biggest project to date, focusing on cards, spells, and creepy bosses. Proudly led by Chanel Lim."
        link="https://ethancreek.itch.io/athenaeum"
        image="/images/games/athenaeum.webp"
      />
      <Game
        style="long-block"
        name="Don't Space Out"
        paragraph="A thrilling space shooter with a spaceship that's out of control."
        link="https://ethancreek.itch.io/dont-space-out"
        image="/images/games/dontspaceout.png"
      />
    </div>
  )
}

function HeroSocials() {
  const socialLinkStyle =
    "text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink"

  return (
    <div className="ml-auto mr-0 mt-8 w-fit">
      <h4 className="text-center text-xl text-text-white">
        Follow us and stay connected!
      </h4>
      <div className="mx-auto mt-4 flex w-52 flex-row justify-between">
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
      </div>
    </div>
  )
}

function Game({
  style,
  name,
  link,
  paragraph,
  image,
}: {
  style: "small-block" | "long-block" | "big-block"
  name: string
  link: string
  paragraph?: string
  image: string
}) {
  const gameStyle = "relative rounded-xl border border-gray-700 overflow-clip"

  if (style == "small-block") {
    return (
      <a
        href={link}
        target="_blank"
        className={`${gameStyle} group col-span-1 row-span-1`}
      >
        <div className="absolute h-full w-full bg-black opacity-40 transition-opacity group-hover:opacity-0" />
        <div className="text-md absolute bottom-1 left-2 select-none font-semibold text-text-white transition-all group-hover:-bottom-12 md:bottom-4 md:left-4 md:text-2xl">
          {name}
        </div>
        <Image
          src={image}
          alt="Image of Takyon"
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </a>
    )
  }

  if (style == "long-block") {
    return (
      <div className={`${gameStyle} group col-span-2 row-span-1`}>
        <div className="flex h-[40%] flex-col justify-center p-4 align-middle">
          <div className="h-fit">
            <a
              href={link}
              target="_blank"
              className="text-md font-semibold text-text-white transition-all md:text-2xl"
            >
              {name}
            </a>
            <p className="w-[60%] text-text-grey">{paragraph}</p>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          className="absolute bottom-0 h-[60%] w-full"
        >
          <div className="absolute h-full w-full bg-black opacity-20 transition-opacity hover:opacity-0" />
          <Image
            src={image}
            alt="Image of Takyon"
            width={2000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </a>
      </div>
    )
  }

  if (style == "big-block") {
    return (
      <div className={`${gameStyle} group col-span-2 row-span-2`}>
        <div className="flex h-[30%] flex-col justify-center p-4 align-middle">
          <div className="h-fit">
            <a
              href={link}
              target="_blank"
              className="text-md font-semibold text-text-white transition-all md:text-2xl"
            >
              {name}
            </a>
            <p className="w-[60%] text-text-grey">
              {paragraph}
              <a
                href={link}
                target="_blank"
                className="block w-fit pt-1 font-bold text-hot-pink"
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
            alt="Image of Takyon"
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </a>
      </div>
    )
  }

  return <div className={`${gameStyle}`}></div>
}
