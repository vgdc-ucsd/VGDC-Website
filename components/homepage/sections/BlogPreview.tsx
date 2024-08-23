import BlogCard from "@/components/BlogCard"

import { Post, getSortedPostsData } from "@/lib/post"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"

export default async function BlogPreview() {
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
