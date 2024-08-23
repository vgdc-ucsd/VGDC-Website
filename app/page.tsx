import Navbar from "@/components/Navbar"
import EventList from "@/components/EventList"
import Contributors from "@/components/Contributors"
import Footer from "@/components/Footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa"
import { SiMinutemailer } from "react-icons/si"
import Image from "next/image"
import Link from "next/link"
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
import Games from "../components/homepage/Games"
import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { motion } from "framer-motion"
import { Mission } from "@/components/homepage/Mission"
import Hero from "@/components/homepage/Hero"
import Companies from "@/components/homepage/Companies"

export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar offsetSpace={false} />
      <Hero />
      <Mission />
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
