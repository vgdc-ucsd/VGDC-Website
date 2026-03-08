"use client"

import Link from "next/link"
import { EventDetails } from "@/lib/events"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import styles from "../page.module.css"

export default function EventView({ event }: { event: EventDetails }) {
  return (
    <section className="mx-auto mt-24 max-w-[920px]">
      <div className="flex flex-col lg:flex-row">
        <motion.div
          initial={{ opacity: 0.6, scale: 0.8, translateX: -50 }}
          whileInView={{ opacity: 1, scale: 1, translateX: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0,
            ease: "easeOut",
            duration: 0.4,
          }}
          className="m-8 flex-[2]"
        >
          <Link
            href="/events"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back`}</Link>
          <h2 className="mt-2 font-inter text-4xl font-bold tracking-tight text-text-white">
            {event.title}
          </h2>
          <h4 className="mt-2 text-xl font-semibold text-hot-pink">
            {event.location}
          </h4>
          <h4 className="text-xl font-semibold text-vgdc-light-green">
            {event.date}
          </h4>
          <h4 className="text-xl font-semibold text-vgdc-light-green">
            {event.time}
          </h4>
          <div className={`${styles["markdown"]} mt-2 text-lg text-text-white`}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({ children, href }) => (
                  <a href={href} className="text-hot-pink" target="_blank">
                    {children}
                  </a>
                ),
              }}
            >
              {event.description}
            </ReactMarkdown>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.6, scale: 0.8, translateX: 50 }}
          whileInView={{ opacity: 1, scale: 1, translateX: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0,
            ease: "easeOut",
            duration: 0.4,
          }}
          className="m-8 mt-14 flex-1"
        >
          <img src={`${event.image}`} className="rounded-xl" />
        </motion.div>
      </div>
    </section>
  )
}
