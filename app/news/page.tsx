import BlogCard from "@/components/news/BlogCard"
import Footer from "@/components/global/Footer"
import Navbar from "@/components/global/Navbar"
import { Post, getSortedPostsData } from "@/lib/post"
import Link from "next/link"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { SectionHeader } from "@/components/global/SectionComponents"

export default async function News() {
  const posts = await getSortedPostsData(0)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto my-20 max-w-[920px] px-8 pb-20 text-white">
        <SectionHeader
          heading="VGDC News"
          subheading="<- back"
          href="./"
          flip={true}
        />

        <div className="mx-auto flex w-fit flex-wrap px-8 sm:w-[36rem] sm:px-0 md:mx-auto md:w-[44rem] md:justify-start lg:mx-6 lg:w-[56rem]">
          {posts.map((post: Post, index) => {
            return (
              <BlogCard
                key={index}
                post={post}
                avatar={createAvatar(notionistsNeutral, {
                  seed: post.author,
                  radius: 50,
                  size: 24,
                }).toDataUriSync()}
              />
            )
          })}
        </div>
      </div>

      <Footer />
    </main>
  )
}
