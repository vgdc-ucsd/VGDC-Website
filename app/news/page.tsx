import Footer from "@/components/global/Footer"
import Navbar from "@/components/global/Navbar"

import PageSection from "@/components/global/PageSection"

import { Post, getSortedPostsData } from "@/lib/post_sheets"

import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import NewsBlogCard from "@/components/news/NewsBlogCard"
import { BlogPostData, getBlogPostsData } from "@/lib/blog_posts"

export const revalidate = 60;
export default async function News() {
  const posts = await getBlogPostsData();

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <PageSection 
        componentStyle="max-w-[68rem]"
        heading="Our News"
        subText="Insights, tips, and news curated by our own board members."
      >
        <div className="mt-12 grid gap-8 min-[968px]:grid-cols-2 mx-auto">
          {posts.map((post: BlogPostData, index) => {
            return (
              <NewsBlogCard
                key={index}
                post={post}
                avatar={createAvatar(notionistsNeutral, {
                  seed: post.authors,
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
