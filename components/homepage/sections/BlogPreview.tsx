import HomeBlogCard from "@/components/news/HomeBlogCard"

import { BlogPostData, getBlogPostsData } from "@/lib/blog_posts"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { SectionHeader, SectionComponent } from "../../global/SectionComponents"

export default async function BlogPreview() {
  const result = await getBlogPostsData(2)
  const posts = result.ok ? result.data : []
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
        {posts.map((post: BlogPostData) => (
          <HomeBlogCard
            key={post.slug}
            post={post}
            avatar={createAvatar(notionistsNeutral, {
              seed: post.authors,
              radius: 50,
              size: 24,
            }).toDataUri()}
          />
        ))}
      </div>

      <Link href="/news" className="block md:hidden mx-auto w-fit">
          <Button>All Posts</Button>
        </Link>
    </SectionComponent>
  )
}
