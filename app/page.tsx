import Navbar from '@/components/Navbar'
import EventList from '@/components/EventList'
import Contributors from '@/components/Contributors'
import Footer from '@/components/Footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaInstagram, FaDiscord, FaFacebook } from 'react-icons/fa'
import { SiMinutemailer } from 'react-icons/si'

export default function Home() {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <Hero />
      <Companies />
      <About />
      <Engagement />
      <Niches />
      <Games />
      <Footer />
    </main>
  )
}

function Hero() {
  return <></>
}

function Companies() {
  return <></>
}

function About() {
  const socialLinkStyle =
    'text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink'

  return (
    <section className="mx-4 flex w-auto flex-col items-center py-12">
      <h2 className=" text-md font-bold text-white md:text-xl lg:text-3xl">
        What is VGDC?
      </h2>

      <div className="mt-4 flex flex-col items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>TR</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <p className="mt-2 text-xs font-bold text-white">President</p>
          <p className="text-xs text-white">Tyler Roache</p>
          <p className="my-0 mt-3 max-w-md text-xs text-text-grey md:text-sm">
            VGDC is a student-run organization at UCSD dedicated to teaching and
            applying software and artistic skills widely used in the video game
            industry.
          </p>
        </div>

        <span className="align-center mt-4 flex w-56 flex-row justify-between">
          <a href="https://www.instagram.com/vgdc.ucsd/" target="_blank">
            <FaInstagram className={socialLinkStyle} size={32} />
          </a>
          <a href="https://bit.ly/VGDCUCSD" target="_blank">
            <FaDiscord className={socialLinkStyle} size={32} />
          </a>
          <a href="https://www.facebook.com/groups/VGDC.UCSD/" target="_blank">
            <FaFacebook className={socialLinkStyle} size={28} />
          </a>
          <a href="mailto:vgdc@ucsd.edu" target="_blank">
            <SiMinutemailer className={socialLinkStyle} size={28} />
          </a>
        </span>
      </div>
    </section>
  )
}

function Engagement() {
  return <></>
}

function Niches() {
  return <></>
}

function Games() {
  return <></>
}
