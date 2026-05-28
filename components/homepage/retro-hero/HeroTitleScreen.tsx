"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface HeroTitleScreenProps {
  onStart?: () => void
}

export default function HeroTitleScreen({ onStart }: HeroTitleScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-vgdc-light-blue/50">

      {/* Layer 1 — Controller (back) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0 }}
      >
        <Image
          src="/logos/Controller.png"
          alt=""
          width={600}
          height={600}
          aria-hidden
          className="w-[100%] object-contain"
        />
      </motion.div>

      {/* Layer 2 — Cloud */}
      <motion.div
        className="absolute inset-0 z-[5] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Image
          src="/logos/Cloud.png"
          alt=""
          width={400}
          height={300}
          aria-hidden
          className="w-[100%] object-contain [image-rendering:pixelated]"
        />
      </motion.div>

      {/* Layer 3 — Title content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="flex w-full flex-col items-center px-[6%] mt-[9%] "
        >
          {/* Title image */}
          <div className="relative w-[42%]">
            <Image
              src="/logos/VGDC_title.png"
              alt="Video Game Development Club"
              width={800}
              height={300}
              className="w-full object-contain"
              priority
            />

            {/* "Voted Best Student Org" floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [1, 1.05, 1] }}
              transition={{
                opacity: { ease: "easeOut", duration: 0.5, delay: 0.3 },
                scale: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.8,
                },
              }}
              className="absolute -right-[10%] top-[-10%] origin-center [rotate:12deg]"
            >
              <p
                className="font-bold text-vgdc-light-blue"
                style={{
                  fontFamily: "Mojangles, monospace",
                  fontSize: "clamp(0.45rem, 1.2vw, 1.25rem)",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
                }}
              >
                Voted Best Student Org 24-25!
              </p>
            </motion.div>
          </div>

          {/* Club name */}
          <h2
            className="mt-[8%] text-center font-extrabold tracking-tight text-text-white "
            style={{
              fontFamily: "Mojangles, monospace",
              fontSize: "clamp(0.6rem, 1.6vw, 1.6rem)",
            }}
          >
            Video Game Development Club
          </h2>

          {/* School name */}
          <h3
            className="mt-[0.5%] bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text text-center font-semibold tracking-tight text-transparent"
            style={{
              fontFamily: "Mojangles, monospace",
              fontSize: "clamp(0.5rem, 1.2vw, 1.2rem)",
            }}
          >
            @ UC San Diego
          </h3>

          {/* START button */}
          {onStart && (
            <motion.button
              onClick={onStart}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-[2%] border-2 border-white bg-black px-[3%] py-[0.8%] text-white hover:bg-white hover:text-black"
              style={{
                fontFamily: "Mojangles, monospace",
                fontSize: "clamp(0.5rem, 1.1vw, 1rem)",
              }}
            >
              ▶ START
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[25]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
        }}
      />

      {/* Layer 4 — Effects (top of everything) */}
      <Image
        src="/logos/Effects.png"
        alt=""
        width={800}
        height={600}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 h-full w-full object-cover"
      />
    </div>
  )
}