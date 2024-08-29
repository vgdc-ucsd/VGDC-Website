import HomeBlogCard from "@/components/news/HomeBlogCard"

import { Post, getSortedPostsData } from "@/lib/post"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { SectionHeader, SectionComponent } from "../../global/SectionComponents"

export default async function BlogPreview() {
  const posts = await getSortedPostsData(2)
  return (
    <SectionComponent>
      <span className="flex flex-col justify-between md:flex-row">
        <SectionHeader
          heading="VGDC News"
          subheading="Stay up to date with the latest highlights of the club"
        />
        <Link href="/news" className="hidden md:block">
          <Button className="mt-4">All Posts</Button>
        </Link>
      </span>

      <div>
        {posts.map((post: Post) => (
          <HomeBlogCard
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

      <Link href="/news" className="block md:hidden mx-auto w-fit">
          <Button>All Posts</Button>
        </Link>
    </SectionComponent>
  )
}
