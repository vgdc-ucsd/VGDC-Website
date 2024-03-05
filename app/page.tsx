import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import Contributors from "@/components/Contributors";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaInstagram,FaDiscord, FaFacebook  } from "react-icons/fa";


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
  );
}

function Hero() {
  return (
    <>
    </>
  )
}

function Companies() {
  return (
    <>
    </>
  )
}

function About() {
  return (
    <section className = "flex items-center flex-col w-auto mx-4 py-12">

      <h2 className = "flex justify-center text-white font-bold text-md md:text-xl lg:text-3xl">
        What is VGDC?
      </h2>

      <div className = "flex items-center flex-col mt-4">

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className = "text-center">
          <p className = "text-white font-bold text-xs mt-2">President</p>
          <p className = "text-white text-xs">Tyler Roache</p>
          <br></br>
          <p className = "text-text-grey text-xs md:text-sm max-w-md my-0">
            VGDC is a student-run organization at UCSD dedicated to teaching and applying software and artistic skills widely used in the video game industry.
          </p>
        </div>

        <span className = "flex flex-row justify-between w-40 mt-4">
          <FaInstagram className="text-white hover:cursor-pointer" size={32}/>
          <FaDiscord className="text-white hover:cursor-pointer" size={32}/>
          <FaFacebook className="text-white transition-colors ease-in hover:cursor-pointer text-red" size={28}/>

        </span>


      </div>
    </section>
  )
}

function Engagement() {
  return (
    <>
    </>
  )
}

function Niches() {
  return (
    <>
    </>
  )
}

function Games() {
  return (
    <>
    </>
  )
}