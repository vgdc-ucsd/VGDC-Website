"use client"

import { motion } from "framer-motion"

export default function Games() {
  const animSpeed = 0.05
  const animDuration = 0.4

  let gameBoxStyle =
    "group relative block bg-vgdc-light-blue rounded-lg overflow-clip cursor-pointer bg-cover"

  function GameContent(name: string) {
    return (
      <>
        <div className="h-full w-full bg-black/50 transition-colors group-hover:bg-black/0" />
        <div className="text-md absolute bottom-1 left-2 select-none font-bold text-white transition-all group-hover:-bottom-16 md:bottom-3 md:left-3 md:text-xl">
          {name}
        </div>
      </>
    )
  }

  return (
    <section className="mx-auto my-36 w-full justify-center px-8 sm:w-[32rem] md:w-[44rem] lg:w-[56rem]">
      <span className="mb-4 flex flex-col justify-between md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-white lg:text-4xl">
            A few of our favorite creations!
          </h2>
          <a
            href="https://vgdc-ucsd.itch.io/"
            target="_blank"
            className="max-w-lg text-sm text-text-grey sm:text-base lg:text-lg"
          >
            {"Browse our itch.io for more ->"}
          </a>
        </div>
      </span>
      <div className="grid w-full grid-cols-2 grid-rows-4 gap-4 sm:grid-cols-4 sm:grid-rows-4 sm:gap-3 lg:gap-4">
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 1,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://ethancreek.itch.io/athenaeum"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/athenaeum.webp')] bg-center sm:col-span-2 sm:row-span-2`}
        >
          {GameContent("Athenaeum")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 2,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://store.steampowered.com/app/1588250/Contract_Killer/"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/contractkiller.jpg')] sm:col-span-2 sm:row-span-1`}
        >
          {GameContent("Contract Killer")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 3,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://creikey.itch.io/skylimit"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/skylimit.png')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Sky Limit")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 4,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://chaseplays.itch.io/spellthief"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/spellthief.png')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Spellthief")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 5,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://angelina007.itch.io/lamplight"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/lamplight.png')] sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("LampLight")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 6,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://wabadaba.itch.io/takyon"
          target="_blank"
          className={`${gameBoxStyle} aspect-square bg-[url('/images/games/takyon.jpg')] bg-center sm:col-span-1 sm:row-span-1`}
        >
          {GameContent("Takyon")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 7,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://www.indiecade.com/patricks-parabox/"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/patricksparabox.png')] bg-center sm:col-span-2 sm:row-span-2`}
        >
          {GameContent("Patrick's Parabox")}
        </motion.a>
        <motion.a
          initial={{ opacity: 0, scale: 0.7, translateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: animSpeed * 8,
            ease: "easeOut",
            duration: animDuration,
          }}
          href="https://ethancreek.itch.io/dont-space-out"
          target="_blank"
          className={`${gameBoxStyle} bg-[url('/images/games/dontspaceout.png')] bg-center sm:col-span-2 sm:row-span-1`}
        >
          {GameContent("Don't Space Out")}
        </motion.a>
      </div>
    </section>
  )
}
