"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Section that provides a descruption of the club's goals.
 *
 * @returns JSX representation of the content.
 */
export function Mission() {
    return(
  
      <section className = {`
        mx-auto px-8 items-center flex flex-col justify-center w-fit lg:p-24 lg:justify-between lg:flex-row
        bg-[url('/logos/GameControlsBlurry.png')] bg-no-repeat bg-contain bg-center`
      }>
  
        <div className = "mb-12 lg:mr-24 mx-auto w-fit">
            <motion.h1
                initial={{ opacity: 0, translateX: -200 }}
                whileInView={{ opacity: 1, translateX: 0 }}
                viewport={{ once: true }}
                transition={{
                    delay: 0,
                    ease: "easeIn",
                    duration: 0.4,
                }}
                className = "text-white text-7xl lg:text-9xl font-extrabold text-center lg:text-left"
            >
                Our <br/> Mission
            </motion.h1>
  
            <motion.div 
                initial={{ opacity: 0, translateX: -200 }}
                whileInView={{ opacity: 1, translateX: 0 }}
                viewport={{ once: true }}
                transition={{
                    delay: 0.05,
                    ease: "easeIn",
                    duration: 0.4,
                }}
                className="flex flex-row items-center w-fit mx-auto lg:mx-0"
            >
                <Avatar className="h-12 w-12">
                <AvatarImage src="/images/officers/2024-2025/kiichiro-wang.jpg" />
                <AvatarFallback>KW</AvatarFallback>
                </Avatar>
                <div className ="mx-4">
                <p className="mt-2 text-base font-bold text-hot-pink xl:text-lg">
                    President
                </p>
                <p className=" mt-[-4px] text-base text-white xl:text-lg">
                    Kiichiro Wang
                </p>
                </div>
            </motion.div>
        </div>
  
        <motion.p 
            initial={{ opacity: 0, translateY: 100 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true }}
            transition={{
                delay: 0,
                ease: "easeIn",
                duration: 0.4,
            }}
            className = "text-base text-text-grey xl:text-lg max-w-[480px] text-center lg:text-left"
        >
          VGDC is a student-run organization at UCSD dedicated to teaching and applying 
          software and artistic skills widely used in the video game industry. 
          Since 2014, we have helped hundreds of people take their first steps into this amazing field. 
        </motion.p>
      </section>
    )
  }
  