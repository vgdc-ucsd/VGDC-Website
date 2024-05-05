import Image from 'next/image'
import Link from 'next/link'
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
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'

/**
 * The navbar for the website, with the logo and navigation.
 *
 * @returns JSX representation of the navbar.
 */
export default function Navbar() {
  let menuButton: string = 'hover:text-light-grey transition-colors text-lg'

  return (
    <>
      {/* Base navbar div, sticky with a blurred background */}
      <div className="sticky left-0 top-0 z-50 h-16 w-full bg-background-black/30 font-light text-text-grey backdrop-blur-lg">
        {/* Contains all components inside navbar */}
        <div className="w-full px-4 py-2">
          {/* The logo, changes size and position dynamically */}
          <Link href="./" className="absolute top-3 block w-fit">
            <Image
              src="/logos/VGDC-logo-no-subtitle.png"
              alt="VGDC Logo"
              width={300}
              height={0}
              className="w-24 cursor-pointer"
            />
          </Link>

          {/* Hamburger menu for mobile, disappears on bigger screens */}
          <div className="absolute right-4 top-3 sm:hidden">
            <Drawer>
              {/* Hamburger icon */}
             
              <DrawerTrigger >
                <IoMenu size={40} className="text-white hover:text-light-grey"/>
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

          {/* Basic menu, dynamically changes  with screen size */}
          <div className="invisible relative text-base top-3 float-right mx-auto w-fit space-x-12 align-middle transition-transform sm:visible lg:float-none lg:space-x-16">
            <Link href="./" className={menuButton}>
              Home
            </Link>
            <Link href="./officers" className={menuButton}>
              Team
            </Link>
            <Link href="./events" className={menuButton}>
              Events
            </Link>
            <Link href="./news" className={menuButton}>
              News
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
