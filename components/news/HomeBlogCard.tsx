"use client"

import { Button } from "@/components/ui/button"
import { Post } from "@/lib/post"
import Image from "next/image"
import Link from "next/link"
import styles from "./BlogCard.module.css" // Import your CSS file
import moment from "moment"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

/**
 * Renders a card with information about a blog post for the home page
 * @param post the Post object containing the data
 * @param avatar a jsx element that displays an image of the author as an illustration
 * @returns
 */
export default function HomeBlogCard({
  post,
  avatar,
}: {
  post: Post
  avatar: string
}) {
  const router = useRouter()

  return (
    <motion.section
      initial={{ opacity: 0, translateY: 100 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      onClick={() => router.push(`news/${post.id}`)}
      className="mb-4 flex h-fit flex-col items-start rounded-lg pt-4 text-white text-white hover:cursor-pointer md:flex-row  lg:items-start"
    >
      <div className="flex-shrink-0 bg-gray-950 pb-4 md:w-80 lg:w-96">
        <Image
          src={`/images/blogs/${post.id}${post.coverImage}`}
          width={600}
          height={600}
          alt="Picture of the post"
          className="aspect-[8/5] rounded-2xl object-cover lg:h-60"
        />
      </div>

      <div className="flex min-w-0 flex-col pb-4 md:pl-4">
        <h2 className="overflow-ellipsis text-2xl font-bold text-white md:truncate lg:text-wrap lg:text-2xl">
          {post.title}
        </h2>

        {/** Card excerpt */}
        <p
          className={`mt-1 w-full text-sm text-text-grey sm:text-base md:max-w-sm lg:mt-2 ${styles["clamped-lines"]} `}
        >
          {post.excerpt}
        </p>

        {/** Card Meta Data */}
        <div className="mt-2 inline-flex items-center">
          <img src={avatar} className="w-8" alt="author cover image" />
          <p className="ml-2 text-base text-white">{post.author}</p>
          <p className="mx-1">•</p>
          {moment(post.date).format("MMMM DD, YYYY")}
        </div>
      </div>
    </motion.section>
  )
}
