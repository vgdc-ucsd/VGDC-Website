"use client"

import { motion } from "framer-motion"

export default function Design() {
  const pillStyle =
    "bg-dark-grey rounded-2xl text-white py-4 px-8 m-2 hover:bg-hot-pink transition ease-in"

  return (
    <section
      className={`
            mx-auto flex w-fit flex-col items-center justify-center px-2 md:h-screen md:px-8
        `}
    >
      <h1 className="text-center text-7xl font-extrabold text-white lg:text-9xl">
        <motion.div
          initial={{ opacity: 0, translateX: -100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block text-vgdc-light-green"
        >
          Design.
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, translateX: 100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block text-vgdc-light-green"
        >
          Code.
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, translateX: -100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Learn.
        </motion.div>
      </h1>

      <p className="mt-4 max-w-[340px] px-8 text-center text-base text-text-grey md:max-w-[400px] lg:max-w-[500px] xl:text-lg">
        We also host workshops throughout the academic year to give our members
        a deeper dive into the tools and skills that power our creativity.
      </p>

      <motion.div
        initial={{ opacity: 0, translateY: 80 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0,
          ease: "easeInOut",
          duration: 0.6,
        }}
        className="mx-auto mt-8 flex max-w-[36rem] flex-wrap justify-center"
      >
        <div className={pillStyle}>Unity</div>
        <div className={pillStyle}>Unreal Engine</div>
        <div className={pillStyle}>Blender</div>
        <div className={pillStyle}>UI/UX</div>
        <div className={pillStyle}>Character Design</div>
        <div className={pillStyle}>Music</div>
        <div className={pillStyle}>Animation</div>
      </motion.div>
    </section>
  )
}
