"use client"

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * The hero that appears at the top of the homepage.
 *
 * @returns JSX representation of the hero.
 */
export default function Hero() {
  return (
    <>
      {/* The full container */}
      {/* "relative h-[15rem] w-full sm:h-[20rem] md:h-[24rem] xl:h-[32rem]" */}
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="relative block h-fit w-fit">
          <motion.div
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
          </motion.div>

          {/* Text & button content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="mx-0 my-12 max-w-fit sm:my-16 md:mx-8 md:my-24"
          >
            {/* Club Name */}
            <h1
              className="mx-auto
                block bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green 
                bg-clip-text text-center font-inter text-4xl font-extrabold tracking-tight
                text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <b>
                Video Game
                <br />
                Development Club
              </b>
            </h1>
            {/* School Name */}
            <h3 className="mt-2 text-center font-inter text-xl tracking-tight text-white sm:mt-4 sm:text-2xl md:mt-6 md:text-3xl lg:mt-8 lg:text-4xl">
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
    </>
  )
}
