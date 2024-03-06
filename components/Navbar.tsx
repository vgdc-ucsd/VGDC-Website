import Image from 'next/image'
import Link from 'next/link'

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
  let menuButton: string = 'hover:text-light-grey transition-colors'

  return (
    <>
      {/* Base navbar div, sticky with a blurred background */}
      <div className="sticky left-0 top-0 h-16 w-full bg-background-black/30 font-light text-text-grey backdrop-blur-lg lg:h-20">
        {/* Contains all components inside navbar */}
        <div className="w-full px-4 py-2 lg:px-6">
          {/* The logo, changes size and position dynamically */}
          <Link
            href="./"
            className="absolute top-3 block w-fit transition-all lg:top-4"
          >
            <Image
              src="/logos/VGDC-logo-no-subtitle.png"
              alt="VGDC Logo"
              width={300}
              height={780}
              className="w-24 cursor-pointer lg:w-32"
            />
          </Link>

          {/* Hamburger menu for mobile, disappears on bigger screens */}
          <div className="absolute right-4 top-3 sm:hidden">
            <Drawer>
              {/* Hamburger icon */}
              <DrawerTrigger className="fill-white hover:fill-light-grey">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="w-10"
                >
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
              </DrawerTrigger>
              {/* Menu buttons */}
              <DrawerContent>
                <DrawerFooter>
                  <Button variant="link" className="text-lg">
                    <Link href="./">Home</Link>
                  </Button>
                  <Button variant="link" className="text-lg">
                    <Link href="./officers">Team</Link>
                  </Button>
                  <Button variant="link" className="text-lg">
                    <Link href="./events">Events</Link>
                  </Button>
                  <Button variant="link" className="text-lg">
                    <Link href="./news">News</Link>
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Basic menu, dynamically changes  with screen size */}
          <div className="invisible relative top-3 float-right mx-auto w-fit space-x-12 align-middle text-xl transition-all sm:visible lg:top-5 lg:float-none lg:space-x-16 lg:text-2xl">
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
