"use client"

import { Button } from "@/components/ui/button"
import { Post } from "@/lib/post"
import Image from "next/image"
import Link from "next/link"
import styles from "./BlogCard.module.css" // Import your CSS file
import moment from "moment"
import { motion } from "framer-motion"

export default function BlogCard({
  post,
  avatar,
}: {
  post: Post
  avatar: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8, translateX: -60 }}
      whileInView={{ opacity: 1, scale: 1, translateX: 0 }}
      viewport={{ once: true }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="mb-8 flex h-fit w-full flex-col items-start rounded-lg pt-4 text-white md:flex-row md:items-center lg:items-start"
    >
      <div className="flex-shrink-0 bg-gray-950 pb-4 md:w-64 lg:w-96">
        <Image
          src={`/images/blogs/${post.id}${post.coverImage}`}
          width={600}
          height={600}
          alt="Picture of the post"
          className="aspect-[8/5] rounded-2xl object-cover lg:h-60"
        />
      </div>

      <div className="min-w-0 pb-4 md:pl-4">
        <h2 className="overflow-ellipsis text-2xl font-bold text-white md:truncate lg:text-wrap lg:text-2xl">
          {post.title}
        </h2>

        {/** Card Meta Data */}
        <div className="mt-2 inline-flex items-center">
          <img src={avatar} className="w-8" alt="author cover image" />
          <p className="ml-2 text-base font-bold text-text-grey">
            {post.author}
          </p>
          <p className="mx-1">•</p>
          {moment(post.date).format("MMMM DD, YYYY")}
        </div>

        {/** Truncated Card content */}
        <div
          className={`${styles["clamped-lines"]} mt-1 max-w-lg text-sm text-text-grey sm:text-base lg:mt-2`}
        >
          <p>{post.excerpt}</p>
        </div>

        <Link href={`news/${post.id}`}>
          <Button className="mt-2 lg:mt-4">Read More</Button>
        </Link>
      </div>
    </motion.section>
  )
}
