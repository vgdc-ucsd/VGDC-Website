"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

/**
 * Section that provides a descruption of the club's goals.
 *
 * @returns JSX representation of the content.
 */
export default function Mission() {
  return (
    <section
      className={`
        mx-auto flex w-fit flex-col items-center justify-center bg-[url('/logos/GameControlsBlurry.png')] bg-contain bg-center bg-no-repeat
        md:px-8 lg:flex-row lg:justify-between lg:p-24`}
    >
      <div className="mx-auto mb-12 w-fit lg:mr-24">
        <motion.h1
          initial={{ opacity: 0, translateX: -200 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            ease: "easeIn",
            duration: 0.6,
            stiffness: 250,
            damping: 56,
          }}
          className="text-center text-7xl font-extrabold text-white lg:text-left lg:text-9xl"
        >
          Our <br /> Mission
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            ease: "easeIn",
            duration: 0.6,
            stiffness: 250,
            damping: 56,
          }}
          className="mx-auto flex w-fit flex-row items-center lg:mx-0"
        >
          <Avatar className="h-12 w-12">
            <Image
              src={"/images/officers/2024-2025/kiichiro-wang.jpg"}
              width={300}
              height={300}
              alt="Image of the president"
            />
            <AvatarFallback>KW</AvatarFallback>
          </Avatar>
          <div className="mx-4">
            <p className="mt-2 text-base font-bold text-hot-pink xl:text-lg">
              President
            </p>
            <p className=" mt-[-4px] text-base text-white xl:text-lg">
              Kiichiro Wang
            </p>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, translateY: 100 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0,
          ease: "easeInOut",
          duration: 0.6,
        }}
        className="max-w-[480px] px-4 text-center text-base text-text-grey lg:text-left xl:text-lg"
      >
        VGDC is a student-run organization at UCSD dedicated to teaching and
        applying software and artistic skills widely used in the video game
        industry. Since 2014, we have helped hundreds of students take their
        first steps into this amazing field.
      </motion.p>
    </section>
  )
}
