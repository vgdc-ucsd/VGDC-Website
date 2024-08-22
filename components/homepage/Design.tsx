"use client"

import { motion } from "framer-motion"

export default function Design() {
    const pillStyle = "bg-dark-grey rounded-2xl text-white py-4 px-8 m-2 hover:bg-hot-pink transition ease-in"

    return(
        <section className = {`
            mx-auto px-8 items-center flex flex-col justify-center w-fit md:h-screen
        `}>

            <p className = "text-hot-pink text-xl mb-4">Workshops</p>
            <h1 className = "text-white text-7xl lg:text-9xl font-extrabold text-center">
                Design
                <br/>
                Code
                <br/>
                Learn
            </h1>

            <p className = "text-base text-text-grey xl:text-lg text-center  md:max-w-[300px] lg:max-w-[500px] mx-24 mt-4">
                We also host workshops throughout the academic year to give our members a deeper 
                dive into the tools and skills that power our creativity. 
            </p>

            <motion.div
                initial={{ opacity: 0, translateY: 80 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                viewport={{ once: true }}
                transition={{
                    delay: 0,
                    ease: "easeIn",
                    duration: 0.6,
                }}
                className="flex max-w-[36rem] flex-wrap justify-center mt-8 mx-auto"
            >   
                <div className = {pillStyle}>Unity</div>
                <div className = {pillStyle}>Unreal Engine</div>
                <div className = {pillStyle}>Blender</div>
                <div className = {pillStyle}>UI/UX</div>
                <div className = {pillStyle}>Character Design</div>
                <div className = {pillStyle}>Music</div>
                <div className = {pillStyle}>Animation</div>



            </motion.div>
 
            

        </section>
    )
}