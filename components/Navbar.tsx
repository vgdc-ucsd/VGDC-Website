"use client"

import Image from "next/image"
import Link from "next/link"
import { IoMenu } from "react-icons/io5"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { GetServerSideProps } from "next"
import { headers } from "next/headers"

import { useState, useEffect } from "react"

/**
 * The navbar for the website, with the logo and navigation.
 *
 * @returns JSX representation of the navbar.
 */
export default function Navbar({ offsetSpace = true, hideOnScroll = true }) {
  let menuButton: string = "hover:text-light-grey transition-colors text-lg"

  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 150) {
      // if scroll down hide the navbar
      setShow(false)
    } else {
      // if scroll up show the navbar
      setShow(true)
    }

    // remember current page location to use in the next move
    setLastScrollY(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar)

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar)
    }
  }, [lastScrollY])

  return (
    <>
      {/* Physically include navbar in page? */}
      {offsetSpace && <div className="relative h-16 bg-black" />}
      {/* Base navbar div, fixed with a blurred background */}
      <div
        className={`fixed left-0 z-50 h-16 w-full bg-background-black/30 font-light text-text-grey backdrop-blur-lg transition-[top] duration-300 ${show || !hideOnScroll ? "top-0" : "-top-20"}`}
      >
        {/* Contains all components inside navbar */}
        <div className="mx-auto w-full max-w-[1200px] px-8 py-2">
          {/* The logo, changes size and position dynamically */}
          <Link href="/" className="absolute top-3 block w-fit">
            <Image
              src="/logos/VGDC-logo-no-subtitle.png"
              alt="VGDC Logo"
              width={300}
              height={0}
              className="w-24 cursor-pointer"
            />
          </Link>

          {/* Hamburger menu for mobile, disappears on bigger screens */}
          <div className="absolute right-7 top-3 sm:hidden">
            <Drawer>
              {/* Hamburger icon */}

              <DrawerTrigger>
                <IoMenu
                  size={40}
                  className="text-white hover:text-light-grey"
                />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="w-10"
                >
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg> */}
              </DrawerTrigger>
              {/* Menu buttons */}
              <DrawerContent>
                <DrawerFooter>
                  <Button variant="link" className="text-base">
                    <Link href="/">Home</Link>
                  </Button>
                  <Button variant="link" className="text-base">
                    <Link href="/officers">Team</Link>
                  </Button>
                  <Button variant="link" className="text-base">
                    <Link href="/events">Events</Link>
                  </Button>
                  <Button variant="link" className="text-base">
                    <Link href="/news">News</Link>
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Basic menu, dynamically changes with screen size */}
          <div className="invisible relative top-3 float-right mx-auto w-fit space-x-12 align-middle text-base transition-transform sm:visible lg:float-none lg:space-x-16">
            <Link href="/" className={menuButton}>
              Home
            </Link>
            <Link href="/officers" className={menuButton}>
              Team
            </Link>
            <Link href="/events" className={menuButton}>
              Events
            </Link>
            <Link href="/news" className={menuButton}>
              News
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
