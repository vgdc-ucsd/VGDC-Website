import Footer from "@/components/global/Footer"
import Navbar from "@/components/global/Navbar"

import PageSection from "@/components/global/PageSection"

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
      <PageSection 
        componentStyle="max-w-[68rem]"
        heading="Our News"
        subText="Insights, tips, and news curated by our own board members."
      >

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
      </PageSection>

      <Footer />
    </main>
  )
}
