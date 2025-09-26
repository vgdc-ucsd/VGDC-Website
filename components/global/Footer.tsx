"use client"
import { z } from "zod"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import RippleText from "../ui/ripple-text"
import Socials from "@/components/ui/socials"
import React from "react"

function Discord({ children = "Discord", className = "" }: { children?: React.ReactNode, className?: string }) {
  return (
    <a
      href="https://bit.ly/VGDCUCSD"
      className={`text-vgdc-light-green ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <b>{children}</b>
    </a>
  )
}

const questions = [
  {
    question: "How do I get involved?",
    answer: (
      <p>
        The easiest way to get involved is to join our <Discord />! Every event, project, and
        fundraiser we run is announced there, and it&apos;s also a great place to meet
        and chat with other game developers. Our general body meeting (GBM) at the start of each quarter
        is another great way to learn more about the club and our plans, but
        you&apos;re welcome to show up to any of our events, no need to wait!
      </p>
    ),
  },
  {
    question: "Are there any leadership opportunities?",
    answer: (
      <p>
        Yes! Our club recruits a couple times a year for a variety of positions,
        and you can find more info about this in our <Discord />. This is a great
        way to become more involved helping with the various things our club does
        (game jams, marketing, our website, etc), while also developing your
        industry skills!
      </p>
    ),
  },
  {
    question: "What if I'm not a programmer?",
    answer: (
      <p>
        Absolutely no problem! Making a game requires people to come together across
        many different disciplines, so in addition to programmers, our club also
        consists of many artists, writers, designers, voice actors, musicians, and
        more!
      </p>
    ),
  },
  {
    question: "What if I haven't made games before?",
    answer: (
      <p>
        No worries, Everyone starts somewhere!
        Our club is designed to give not only active game developers but any interested
        student an introduction to the world of game development. We regularly teach
        workshops covering skills including (but not limited to): programming (Unity),
        design, art, music, etc. These workshops tend to be more concentrated in Fall
        Quarter, but are also run throughout the remainder of the academic year. In
        addition, we also run a beginner-friendly Game Jam, where you get the chance
        to get hands on experience working on a game in a team with other students!
      </p>
    ),
  },
  {
    question: "I still have more questions!",
    answer: (
      <p>
        We&apos;d be happy to help! The best way to reach us is through <Discord />,
        although you can also find us at those other socials (to the right).
      </p>
    ),
  }
]

const formSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
})

/**
 * The footer that appears at the bottom of every page.
 *
 * @returns JSX representation of the hero.
 */
export default function Footer() {
  return (
    <div className="bg-footer-grey">
      {/* Responsive flexbox containing the FAQs, social links, and extra box. */}
      <div className="mx-auto mt-[4rem] flex w-full max-w-full flex-col justify-center pt-8 sm:w-fit md:mt-[8rem] lg:flex-row-reverse lg:space-x-4">
        {/* Social links */}
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          {/*<SocialLinks />*/}
          <Socials variant="footer" />
          <div className="mt-10 box-border rounded-lg bg-background-grey/50 p-5">
            <div className="text-center text-lg text-white">Contact us!</div>
            <div className="mx-auto w-fit text-center">
              <a
                href={`mailto:vgdc@ucsd.edu`}
                className="text-center font-bold"
              >
                <RippleText className="text-4xl">
                  <span className="text-v-color">v</span>
                  <span className="text-g-color">g</span>
                  <span className="text-d-color">d</span>
                  <span className="text-c-color">c</span>
                  <span className="text-lg text-[#A7E7D0]">@</span>
                  <span className="text-[#D3F3E7]">u</span>
                  <span className="text-[#D3F3E7]">c</span>
                  <span className="text-[#D3F3E7]">s</span>
                  <span className="text-[#A7E7D0]">d</span>
                  <span className="text-c-color">.</span>
                  <span className="text-d-color">e</span>
                  <span className="text-g-color">d</span>
                  <span className="text-v-color">u</span>
                </RippleText>
              </a>
            </div>
          </div>
          <div className="my-8 flex flex-col items-center gap-1 text-center text-lg text-text-white ">
            Support us!
            <div className="hover:animate-gradient rounded-lg bg-gradient-to-r from-[#267392] via-[#0eb9ae] via-[#0eb9ae] via-[#3c99aa] via-[#3c99aa] via-[#50d0a1] to-[#267392] bg-[length:200%_100%] p-1 text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(14,185,174,0.2)]">
              {" "}
              <a
                href="https://ko-fi.com/vgdcatucsd"
                target="_blank"
                className="block rounded-lg bg-footer-grey px-4 py-2 font-bold text-white"
              >
                ☕ Become a Donor!
              </a>
            </div>
          </div>
        </div>
        {/* FAQs */}
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          <FAQs />
        </div>
      </div>
      <div className="py-8 text-center font-medium text-text-grey">
        Video Game Development Club
        <br className="visible sm:hidden" />
        {" © "}
        {new Date().getFullYear()}
      </div>
    </div>
  )
}

/**
 * The FAQs in the footer.
 *
 * @returns The JSX of the FAQs.
 */
function FAQs() {
  return (
    <>
      {/* Header */}
      <h3 className="mb-4 text-2xl font-semibold text-text-white lg:text-4xl">
        FAQs
      </h3>
      {/* List of questions */}
      <div className="text-sm text-white">
        <Accordion type="single" collapsible>
          {/* Map each question to an accordion item */}
          {questions.map((faq, index) => {
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-4"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </>
  )
}
