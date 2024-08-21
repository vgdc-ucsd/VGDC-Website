"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa"
import { SiMinutemailer } from "react-icons/si"

export default function About() {
  const socialLinkStyle =
    "text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink"

  return (
    <motion.section
      initial={{ opacity: 0.6, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="mx-4 mb-36 mt-4 flex w-auto flex-col items-center"
    >
      <h2 className="text-2xl font-bold text-white lg:text-4xl">
        What is VGDC?
      </h2>

      <div className="mt-4 flex flex-col items-center">
        <Image
          src="/images/officers/2024-2025/kiichiro-wang.jpg"
          width={100}
          height={100}
          alt={"Image of Kiichiro Wang"}
          className="h-16 w-16 rounded-full"
        />

        <div className="text-center">
          <p className="mt-2 text-base font-bold text-hot-pink xl:text-lg">
            President
          </p>
          <p className=" mt-[-4px] text-base text-white xl:text-lg">
            Kiichiro Wang
          </p>
          <p className="my-0 mt-3 w-[72vw] max-w-lg text-sm text-text-grey sm:text-base">
            VGDC is a student-run organization at UCSD dedicated to teaching and
            applying software and artistic skills widely used in the video game
            industry.
          </p>
        </div>

        <span className="align-center mt-4 flex w-56 flex-row justify-between">
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
        </span>
      </div>
    </motion.section>
  )
}
