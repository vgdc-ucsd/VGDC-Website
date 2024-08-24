"use client"

import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from "../../ui/carousel"
import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeader } from "../shared/HomepageComponents"

/**
 *
 * @returns
 */
export default function Companies() {
  const carouselStyle = "basis-1/2 sm:basis-1/3 xl:basis-1/4"

  // This configures the size of each company logo
  const companyLogoStyle = "mx-auto w-32 lg:w-40"

  // List of companies & data to be shown in the carousel
  const companies = [
    {
      name: "XBOX Game Studios",
      logo: "/logos/companies/xbox-game-studios.png",
      link: "https://www.xbox.com/xbox-game-studios",
    },
    {
      name: "Playstation",
      logo: "/logos/companies/playstation.png",
      link: "https://www.playstation.com/",
    },
    {
      name: "Google",
      logo: "/logos/companies/google.png",
      link: "https://about.google/",
    },
    {
      name: "Blizzard Entertainment",
      logo: "/logos/companies/blizzard.png",
      link: "https://www.blizzard.com/",
    },
    {
      name: "Supergiant Games",
      logo: "/logos/companies/supergiant.png",
      link: "https://www.supergiantgames.com/",
    },
    {
      name: "The Behemoth",
      logo: "/logos/companies/behemoth.png",
      link: "https://www.thebehemoth.com/",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 0.8, translateY: 20 }}
      whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
      viewport={{ once: true }}
      transition={{
        ease: "easeOut",
        duration: 0.4,
      }}
      className="relative my-36 w-full"
    >
      {/* Text above carousel */}
      <SectionHeader
        heading="Our members are everywhere!"
        subheading="Top companies our alumni work at!"
        textAlign="center"
      />

      {/* List of companies */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="mx-auto w-48 sm:w-96 md:w-[36rem] xl:w-[56rem]"
      >
        <CarouselPrevious />
        <CarouselContent>
          {/* Iterate through all the companies in the array to populate carousel */}
          {companies.map((company, index) => {
            return (
              <CarouselItem className={carouselStyle} key={index}>
                <a href={company.link} target="_blank">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    // width and height alter the resolution of the image
                    width={500}
                    height={500}
                    className={companyLogoStyle}
                  />
                </a>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </motion.div>
  )
}
