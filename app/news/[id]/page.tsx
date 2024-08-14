import React, { useContext } from "react"
import { generateNeighbors, getPostData } from "@/lib/post"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { parseISO, format } from "date-fns"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import styles from "./page.module.css"
import { createAvatar } from "@dicebear/core"
import { notionistsNeutral } from "@dicebear/collection"
import { headers } from "next/headers"
import TwitterButton from "@/components/ui/social-share-button"
import { notFound } from "next/navigation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import BackButton from "@/components/ui/back-button"
import Footer from "@/components/Footer"
import SocialShareButton from "@/components/ui/social-share-button"
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

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

export default async function BlogPage({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id)
  const { previousPost, nextPost } = await generateNeighbors(params.id)

  if (post == null) {
    notFound()
  }

  // grab full url path
  const headerList = headers()
  const fullpath = headerList.get("x-current-path")
  const hostname = headerList.get("x-host-name")

  // For testing purposes only. Replace with your custom forwarded host
  const testfullpath = `https://5742-2600-1700-7c01-1380-d136-ab79-e586-c1e3.ngrok-free.app/news/${post.id}`
  const testhostname =
    "https://5742-2600-1700-7c01-1380-d136-ab79-e586-c1e3.ngrok-free.app"

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

      <head>
        <meta property="og:site_name" content="Video Game Development Club" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={fullpath!} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`}
        />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />

        {/** metadata to define content for twitter previews */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@vgdc" />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.excerpt} />
        <meta
          property="twitter:image"
          content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`}
        />
      </head>

      <div className="mx-auto mt-6 flex max-w-[920px] flex-col justify-center pb-20 text-white md:mt-20 lg:flex-row">
        <div className="sticky left-0 top-0 mx-6 mb-4 mr-8">
          <BackButton />
        </div>

        <article className="mx-6 align-middle">
          {/**Blog MetaData */}
          <div className="mb-4 flex w-full flex-row justify-between text-text-grey">
            <div className="mt-1 flex h-fit flex-row align-middle">
              <img
                src={avatar}
                className="mr-2 w-12"
                alt="author cover image"
              />
              <div className="ml-1 flex flex-col justify-center">
                <p className="text-sm sm:text-base">{post.author}</p>
                {/* <p className="text-xs sm:text-sm">{calculateReadingTime(post.content)} Min Read</p>  */}
                <DateFormat dateString={post.date} />
              </div>
            </div>

            <div className="flex-right">
              <p className="right m-0 hidden w-full text-center text-sm text-text-grey sm:block sm:text-base">
                Share this blog
              </p>
              <div className="mt-1 hidden sm:flex">
                <TwitterButton url={fullpath!} network="twitter" post={post} />
                <TwitterButton url={fullpath!} network="facebook" post={post} />
                <TwitterButton url={fullpath!} network="linkedin" post={post} />
              </div>
            </div>
          </div>

          {/**Cover Image */}
          <Image
            src={`/images/blogs/${post.id}${post.coverImage}`}
            width={800}
            height={600}
            alt="Cover Image"
            className="aspect-[8/5] w-full rounded-2xl object-cover"
          />

          <h1 className="mb-2 mt-8 text-3xl font-extrabold text-gray-200 md:text-4xl">
            {post.title}
          </h1>

          {/**Blog Content */}
          <ReactMarkdown
            className={`${styles["markdown"]} mt-2 text-sm text-text-grey md:text-base`}
            rehypePlugins={[rehypeRaw]}
            components={{
              // add a css for p tagsxs

              img: (image) => {
                return (
                  <Image
                    src={image.src!}
                    alt={image.alt!}
                    height="768"
                    width="432"
                    style={{ borderRadius: "12px", width: "100%" }}
                  />
                )
              },
              code({ children, className }) {
                // Detect which programming language is being used
                const match = /language-(\w+)/.exec(className || "")
                const language = match ? match[1] : "" // Extract the language from className

                return (
                  <SyntaxHighlighter
                    language={language}
                    customStyle={{ borderRadius: "12px" }}
                    style={vscDarkPlus}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                )
              },
              a: ({ children, href }) => (
                <a href={href} className="text-hot-pink" target="_blank">
                  {children}
                </a>
              ),
              h3({ node, className, children, ...props }) {
                return (
                  <h2
                    style={{
                      marginBottom: "0",
                      color: "rgb(229 231 235)",
                      transform: "translateY(6px)",
                      fontSize: "1.2rem",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </h2>
                )
              },
              h2({ node, className, children, ...props }) {
                return (
                  <h2
                    style={{
                      marginBottom: "0",
                      color: "rgb(229 231 235)",
                      transform: "translateY(6px)",
                      fontSize: "1.5rem",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </h2>
                )
              },
              h1({ node, className, children, ...props }) {
                return (
                  <h2
                    style={{
                      marginBottom: "0",
                      color: "rgb(229 231 235)",
                      transform: "translateY(6px)",
                      fontSize: "1.8rem",
                      lineHeight: "1.5rem",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </h2>
                )
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
          {/** Section to view more blog posts */}

          <p className="mt-8 text-sm text-text-grey sm:text-base">
            Share this blog
          </p>
          <div className="mt-2 flex">
            <TwitterButton url={testfullpath} network="twitter" post={post} />
            <TwitterButton url={testfullpath} network="facebook" post={post} />
            <TwitterButton url={testfullpath} network="linkedin" post={post} />
          </div>
          <section className="mt-12">
            <hr></hr>
            {/* <h2 className="text-2xl font-bold text-white mt-4">Read more</h2> */}

            <div className="mt-8 flex w-full justify-between">
              <div className="mr-8 flex items-center">
                {previousPost && (
                  <Link href={`/news/${previousPost.id}`}>
                    <p className="mr-2 text-sm text-white">Previous</p>
                    <p className="text-white">{previousPost.title}</p>
                  </Link>
                )}
              </div>

              <div className="ml-auto flex items-center">
                {nextPost && (
                  <Link href={`/news/${nextPost.id}`}>
                    <p className="mr-2 text-sm text-white">Next</p>
                    <p className="text-white">{nextPost.title}</p>
                  </Link>
                )}
              </div>
            </div>
          </section>
        </article>
      </div>

      <Footer />
    </main>
  )
}

export function DateFormat({ dateString }: { dateString: string }) {
  const date = parseISO(dateString)
  return (
    <time className="text-sm text-text-grey sm:text-base" dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  )
}

function calculateReadingTime(content: string) {
  const wordsPerMinute = 200 // Adjust according to your audience's reading speed
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}
