import Navbar from "@/components/Navbar"
import EventList from "@/components/EventList"
import Contributors from "@/components/Contributors"
import Footer from "@/components/Footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa"
import { SiMinutemailer } from "react-icons/si"
import Image from "next/image"
import Link from "next/link"
import { useSpring, animated } from "react-spring"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Post, getSortedPostsData } from "@/lib/post"
import BlogCard from "@/components/BlogCard"
import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { GetServerSideProps } from "next"

export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar offsetSpace={false} />
      <Hero />
      <About />
      <EventList />
      <BlogPreview />
      {/* <Engagement /> */}
      <Games />
      {/* <Niches /> */}
      <Companies />
      <Footer />
    </main>
  )
}

/**
 * The hero that appears at the top of the homepage.
 *
 * @returns JSX representation of the hero.
 */
function Hero() {
  return (
    <>
      {/* The full container */}
      {/* "relative h-[15rem] w-full sm:h-[20rem] md:h-[24rem] xl:h-[32rem]" */}
      <div className="relative flex h-screen w-full items-center justify-center">
        <div className="relative block h-fit w-fit">
          <Image
            src="/icons/controller.svg"
            alt="Controller icon"
            width={160}
            height={160}
            className="absolute left-0 top-8 w-12 sm:w-20 md:w-28 lg:w-36"
          />

          <Image
            src="/icons/laptop.svg"
            alt="Controller icon"
            width={160}
            height={160}
            className="absolute right-0 top-8 w-12 sm:w-20 md:w-28 lg:w-36"
          />
          {/* Text & button content */}
          <div className="mx-0 my-12 max-w-fit sm:my-16 md:mx-8 md:my-24">
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
          </div>
        </div>
      </div>
    </>
  )
}

/**
 *
 * @returns
 */
function Companies() {
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
    <>
      <div className="relative my-36 w-full">
        {/* Text above carousel */}
        <h2 className="text-center text-2xl font-bold text-white lg:text-4xl">
          Our members are everywhere!
        </h2>

        <h4 className="text-center font-inter text-sm text-text-grey sm:text-base lg:mt-2 xl:text-lg">
          Top companies our alumni work at!
        </h4>

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
      </div>
    </>
  )
}

function About() {
  const socialLinkStyle =
    "text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink"

  return (
    <section className="mx-4 mb-36 flex w-auto flex-col items-center">
      <h2 className="text-2xl font-bold text-white lg:text-4xl">
        What is VGDC?
      </h2>

      <div className="mt-4 flex flex-col items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/images/officers/2024-2025/kiichiro-wang.jpg" />
          <AvatarFallback>KW</AvatarFallback>
        </Avatar>

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
    </section>
  )
}

async function BlogPreview() {
  const posts = await getSortedPostsData(2)

  return (
    <section className="mx-auto my-36 w-fit justify-center px-8 sm:w-[32rem] md:w-[44rem] lg:w-[56rem]">
      <span className="mb-8 flex flex-col justify-between md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-white lg:text-4xl">
            VGDC News
          </h2>
          <p className="max-w-lg text-sm text-text-grey sm:text-base lg:text-lg">
            Stay up to date with the latest highlights of the club
          </p>
        </div>

        <Link href="/news">
          <Button className="mt-4">All Posts</Button>
        </Link>
      </span>

      <div>
        {posts.map((post: Post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

function Engagement() {
  return <></>
}

function Niches() {
  return <></>
}

function Games() {
  let gameBoxStyle =
    "group relative block bg-vgdc-light-blue rounded-lg overflow-clip cursor-pointer bg-cover"

  function GameContent(name: string) {
    return (
      <>
        <div className="h-full w-full bg-black/50 transition-colors group-hover:bg-black/0" />
        <div className="text-md absolute bottom-1 left-2 select-none font-bold text-white transition-all group-hover:-bottom-16 md:bottom-3 md:left-3 md:text-xl">
          {name}
        </div>
      </>
    )
  }

  return (
    <section className="mx-auto my-36 w-full justify-center px-8 sm:w-[32rem] md:w-[44rem] lg:w-[56rem]">
      <span className="mb-4 flex flex-col justify-between md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-white lg:text-4xl">
            A few of our favorite creations!
          </h2>
          <a
            href="https://vgdc-ucsd.itch.io/"
            target="_blank"
            className="max-w-lg text-sm text-text-grey sm:text-base lg:text-lg"
          >
            {"Browse our itch.io for more ->"}
          </a>
        </div>
      </span>
      <div className="grid w-full grid-cols-2 grid-rows-4 gap-4 sm:grid-cols-4 sm:grid-rows-4 sm:gap-3 lg:gap-4">
        <a
          href="https://ethancreek.itch.io/athenaeum"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/athenaeum.webp')] bg-center sm:col-span-2 sm:row-span-2`}
        >
          {GameContent("Athenaeum")}
        </a>
        <a
          href="https://store.steampowered.com/app/1588250/Contract_Killer/"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/contractkiller.jpg')] sm:col-span-2 sm:row-span-1`}
        >
          {GameContent("Contract Killer")}
        </a>
        <a
          href="https://creikey.itch.io/skylimit"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/skylimit.png')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Sky Limit")}
        </a>
        <a
          href="https://chaseplays.itch.io/spellthief"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/spellthief.png')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Spellthief")}
        </a>
        <a
          href="https://angelina007.itch.io/lamplight"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/lamplight.png')] sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("LampLight")}
        </a>
        <a
          href="https://wabadaba.itch.io/takyon"
          target="_blank"
          className={`${gameBoxStyle} aspect-square bg-[url('/images/games/takyon.jpg')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Takyon")}
        </a>
        <a
          href="https://www.indiecade.com/patricks-parabox/"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/patricksparabox.png')] bg-center sm:col-span-2 sm:row-span-2`}
        >
          {GameContent("Patrick's Parabox")}
        </a>
        <a
          href="https://ethancreek.itch.io/dont-space-out"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/dontspaceout.png')] bg-center sm:col-span-2 sm:row-span-1`}
        >
          {GameContent("Don't Space Out")}
        </a>
      </div>
    </section>
  )
}
