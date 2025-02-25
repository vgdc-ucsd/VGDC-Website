"use client"

import TwitterButton from "@/components/ui/social-share-button"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import moment from "moment"
import styles from "../page.module.css"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight"
import Link from "next/link"
import { motion } from "framer-motion"

export default function BlogView({
  post,
  avatar,
  fullpath,
  previousPost,
  nextPost,
}: any) {
  return (
    <article className="mx-8 align-middle">
      {/**Blog MetaData */}
      <motion.div
        initial={{ opacity: 0.6, translateX: -100 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0,
          ease: "easeOut",
          duration: 0.4,
        }}
        className="mb-4 flex w-full flex-row justify-between text-text-grey"
      >
        <div className="mt-1 flex h-fit flex-row align-middle">
          <img src={avatar} className="mr-2 w-12" alt="author cover image" />
          <div className="ml-1 flex flex-col justify-center">
            <p className="text-sm sm:text-base">{post.author}</p>
            {/* <p className="text-xs sm:text-sm">{calculateReadingTime(post.content)} Min Read</p>  */}
            {moment(post.date).format("MMMM DD, YYYY")}
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
      </motion.div>

      {/**Cover Image */}
      <motion.div
        initial={{ opacity: 0.6, translateX: -100 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.05,
          ease: "easeOut",
          duration: 0.4,
        }}
        className="aspect-[8/5] w-full object-cover"
      >
        <Image
          src={`/images/blogs/${post.id}${post.coverImage}`}
          width={800}
          height={600}
          alt="Cover Image"
          className="h-full w-full rounded-2xl"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0.6, translateX: -100 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.1,
          ease: "easeOut",
          duration: 0.4,
        }}
        className="mb-2 mt-8 text-3xl font-extrabold text-gray-200 md:text-4xl"
      >
        {post.title}
      </motion.h1>

      {/**Blog Content */}
      <motion.div
        initial={{ opacity: 0.6, translateX: -100 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.15,
          ease: "easeOut",
          duration: 0.4,
        }}
      >
        <ReactMarkdown
          className={`${styles["markdown"]} mt-2 text-sm text-text-grey md:text-base`}
          rehypePlugins={[rehypeRaw]}
          components={{
            // add a css for p tagsxs
            p: ({ children }) => {
              return <div className={`${styles["mdblock"]}`}>{children}</div>
            },
            // For audio, use this in markdown:
            // <audio>/audio/blogs/blog-post/song.mp3</audio>
            // And use only mp3 and ogg files
            audio: ({ node, className, children, ...props }) => {
              let filename = children?.toString()
              if (!filename) {
                return "There was an issue with the audio file."
              }
              let extension = filename.split(".").pop()
              let audioType = ""
              if (extension == "ogg") {
                audioType = "audio/ogg"
              } else if (extension == "mp3") {
                audioType = "audio/mpeg"
              } else {
                return "There was an issue with the audio file."
              }
              return (
                <audio controls className={`${styles["audioblock"]}`}>
                  <source src={children?.toString()} type={audioType} />
                  Your browser does not support the audio element.
                </audio>
              )
            },
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
            em: ({ children }) => (
              <em className="mt-2 block w-full text-center">{children}</em>
            ),
            h3({ node, className, children, ...props }) {
              return (
                <h2
                  style={{
                    marginBottom: "0",
                    color: "rgb(229 231 235)",
                    transform: "translateY(6px)",
                    fontSize: "1.2rem",
                    lineHeight: "1.75rem",
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
                    lineHeight: "2rem",
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
                    lineHeight: "2.25rem",
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
      </motion.div>
      {/** Section to view more blog posts */}

      <p className="mt-8 text-sm text-text-grey sm:text-base">
        Share this blog
      </p>
      <div className="mt-2 flex">
        <TwitterButton url={fullpath!} network="twitter" post={post} />
        <TwitterButton url={fullpath!} network="facebook" post={post} />
        <TwitterButton url={fullpath!} network="linkedin" post={post} />
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
  )
}
