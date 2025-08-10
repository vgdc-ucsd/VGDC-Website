"use client"

import { motion } from "framer-motion"

export default function Design() {
  const skills = [
    "Unity", "Unreal Engine", "Blender", "UI/UX", 
    "Character Design", "Music", "Animation"
  ]

  return (
    <section
      className={`
            mx-auto flex w-fit flex-col items-center justify-center px-2 py-12 md:px-8
        `}
    >
      <h1 className="text-center text-7xl font-extrabold text-white lg:text-9xl">
        <motion.div
          initial={{ opacity: 0, translateX: -100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="inline-block text-v-color"
        >
          Design.
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, translateX: 100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block text-g-color"
        >
          Code.
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, translateX: -100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="inline-block text-d-color"
        >
          Learn.
        </motion.div>
        <br />
        <motion.div
          initial={{ opacity: 0, translateX: 100 }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="inline-block text-c-color"
        >
          Create.
        </motion.div>
      </h1>

      <motion.p 
        initial={{ opacity: 0, translateY: 20 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 1.0 }}
        viewport={{ once: true }}
        className="mt-4 max-w-[340px] px-8 text-center text-base text-text-grey md:max-w-lg lg:max-w-xl md:text-lg"
      >
        We also host workshops throughout the academic year to give our members
        a deeper dive into the tools and skills that power our creativity.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, translateY: 80 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0,
          ease: "easeInOut",
          duration: 0.6,
        }}
        className="mx-auto mt-8 text-center leading-relaxed"
      >
        {skills.map((skill, index) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-text-grey text-lg font-light"
          >
            {index != 0 && (
              <span className="text-vgdc-light-green mx-2">•</span>
            )}
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </section>
  )
}
