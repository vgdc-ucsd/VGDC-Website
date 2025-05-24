import Footer from "@/components/global/Footer"
import Navbar from "@/components/global/Navbar"

import { PageComponent, PageHeader } from "@/components/global/PageComponents"

import { Post, getSortedPostsData } from "@/lib/post_sheets"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import NewsBlogCard from "@/components/news/NewsBlogCard"

export const revalidate = 60;
export default async function News() {
  const posts = await getSortedPostsData(0)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <PageComponent componentStyle="max-w-[68rem]">
        <PageHeader
          heading="Our News"
          subheading="Insights, tips, and news curated by our own board members. "
          href="./"
          flip={false}
          textAlign="center"
          headingClassName="mx-auto w-fit text-7xl lg:text-9xl mb-2"
          subheadingClassName=""
        />

        <div className="mt-12 grid gap-8 min-[968px]:grid-cols-2 mx-auto">
          {posts.map((post: Post, index) => {
            return (
              <NewsBlogCard
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
      </PageComponent>

      <Footer />
    </main>
  )
}
