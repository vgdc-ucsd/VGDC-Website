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
import About from "../components/homepage/About"
import Hero from "../components/homepage/Hero"
import Games from "../components/homepage/Games"
import Companies from "@/components/homepage/Companies"
import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar offsetSpace={false} />
      <Hero />
      <About />
      <EventList />
      <BlogPreview />
      <Games />
      <Companies />
      <Footer />
    </main>
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
          <BlogCard
            key={post.id}
            post={post}
            avatar={createAvatar(notionistsNeutral, {
              seed: post.author,
              radius: 50,
              size: 24,
            }).toDataUriSync()}
          />
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
