import React, { useContext } from "react"
import { generateNeighbors, getPostData } from "@/lib/post"
import { parseISO, format } from "date-fns"
import Image from "next/image"
import Navbar from "@/components/global/Navbar"
import Link from "next/link"
import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs"
import BackButton from "@/components/ui/back-button"
import Footer from "@/components/global/Footer"
import SocialShareButton from "@/components/ui/social-share-button"
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Metadata } from "next"
import BlogView from "./components/BlogView"

/**
 * This page holds the content for a
 * specific blog post. It fetches the id of the
 * blog from the URL params and then fetches the
 * file contents using getPostData()
 *
 * ReactMarkdown is then used to display the
 * blog content.
 */

{
  /* test meta tags
<meta property="og:site_name" content="Video Game Development Club" />
<meta property="og:title" content={post.title} />
<meta property="og:description" content={post.excerpt} />
<meta property="og:url" content={testfullpath}/>
<meta property="og:type" content="article" />
<meta property="og:image" content={`${testhostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="640" />

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:site" content ="@vgdc"/>
<meta property="twitter:title" content={post.title}/>
<meta property="twitter:description" content = {post.excerpt} />
<meta property="twitter:image" content={`${testhostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
 */
}

{
  /*
<meta property="og:site_name" content="Video Game Development Club" />
<meta property="og:title" content={post.title} />
<meta property="og:description" content={post.excerpt} />
<meta property="og:url" content={fullpath!}/>
<meta property="og:type" content="article" />
<meta property="og:image" content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="640" />

{/** metadata to define content for twitter previews 
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:site" content ="@vgdc"/>
<meta property="twitter:title" content={post.title}/>
<meta property="twitter:description" content = {post.excerpt} />
<meta property="twitter:image" content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
 */
}

export async function generateMetadata({ params }: any) {
  const post = await getPostData(params.id)

  if (post != null) {
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        siteName: "Video Game Development Club",
        title: post.title,
        description: post.excerpt,
        url: `https://vgdc.dev/news/${params.id}`,
        type: "article",
        images: [
          {
            url: `https://vgdc.dev/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`,
            width: 1280,
            height: 640,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@UCSDVGDC",
        title: post.title,
        description: post.excerpt,
        creator: "@vgdc",
        images: [
          `https://vgdc.dev/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`,
        ],
      },
    }
  } else {
    return {
      title: "VGDC @ UCSD",
    }
  }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id)
  const { previousPost, nextPost } = await generateNeighbors(params.id)

  if (post == null) {
    notFound()
  }

  // grab full url path
  const headerList = headers()
  const fullpath = headerList.get("x-current-path")

  const avatar = createAvatar(notionistsNeutral, {
    seed: post!.author,
    radius: 50,
    size: 24,
  }).toDataUriSync()

  // const transformUri = (uri: string) => {
  //     if (uri.startsWith('/images/')) {
  //         console.log('hit')
  //       // Assuming images are in public/images directory
  //       return `${uri}`;
  //     }
  //     return uri;
  //   };

  function ImageRenderer(src: string, alt: string, title: string) {
    return (
      <img src={src} alt={alt} title={title} style={{ maxWidth: "100%" }} />
    )
  }

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <div className="mx-auto mt-6 flex max-w-[920px] flex-col justify-center pb-20 text-white md:mt-20 lg:flex-row">
        <div className="sticky left-0 top-0 mx-8 mb-4 mr-8">
          <BackButton />
        </div>

        <BlogView
          post={post}
          avatar={avatar}
          fullpath={fullpath}
          nextPost={nextPost}
          previousPost={previousPost}
        />
      </div>

      <Footer />
    </main>
  )
}

// export function DateFormat({ dateString }: { dateString: string }) {
//   const date = parseISO(dateString)
//   return (
//     <time className="text-sm text-text-grey sm:text-base" dateTime={dateString}>
//       {format(date, "LLLL d, yyyy")}
//     </time>
//   )
// }

function calculateReadingTime(content: string) {
  const wordsPerMinute = 200 // Adjust according to your audience's reading speed
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}
