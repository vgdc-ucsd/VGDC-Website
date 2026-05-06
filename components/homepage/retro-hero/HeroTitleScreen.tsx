"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function HeroTitleScreen() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ backgroundColor: "#1e2235" }}>
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
        }}
      />

      {/* Title content */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        className="relative z-20 mx-0 my-8 max-w-fit px-6 sm:my-12 md:mx-8 md:my-16"
      >
        {/* Title image */}
        <div className="relative">
          <Image
            src="/logos/VGDC_title.png"
            alt="Video Game Development Club"
            width={800}
            height={300}
            className="mx-auto block w-[280px] sm:w-[380px] md:w-[520px] lg:w-[680px]"
            priority
          />

          {/* "Voted Best Student Org" floating badge */}
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
            className="absolute origin-center top-[-2rem] -right-[0rem] [rotate:5deg] sm:top-[0.5rem] sm:-right-[4rem] sm:[rotate:20deg] md:top-[1rem] md:-right-[5rem] lg:top-[1.5rem] lg:-right-[8rem]"
          >
            <p
              className="text-base font-bold text-vgdc-light-blue sm:text-lg md:text-xl lg:text-3xl"
              style={{
                fontFamily: "Mojangles, monospace",
                textShadow: "2px 2px 0px rgba(0, 0, 0, 0.5)",
              }}
            >
              Voted Best Student Org 24-25!
            </p>
          </motion.div>
        </div>

        {/* Club name — smaller subtitle */}
        <h2 className="mt-2 text-center text-lg font-extrabold tracking-tight text-text-white sm:mt-3 sm:text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: "Mojangles, monospace" }}>
          Video Game Development Club
        </h2>

        {/* School name */}
        <h3 className="mt-1 bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text text-center text-base font-semibold tracking-tight text-transparent sm:mt-2 sm:text-lg md:mt-3 md:text-xl lg:mt-4 lg:text-2xl" style={{ fontFamily: "Mojangles, monospace" }}>
          @ UC San Diego
        </h3>
      </motion.div>
    </div>
  )
}
