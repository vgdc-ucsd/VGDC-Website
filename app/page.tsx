import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import Contributors from "@/components/Contributors";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <section className = "flex justify-center flex-col w-screen">

      <h2 className = "flex justify-center text-white font-bold text-md md:text-xl lg:text-3xl">
        What is VGDC
      </h2>

      <span className = "flex justify-center flex-col">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className = "text-white font-bold text-xs text-center">President</p>
          <p className = "text-white text-xs text-center">Tyler Roache</p>
          <br></br>
          <p className = "text-text-grey text-sm text-center">
            VGDC is a student-run organization at UCSD dedicated to teaching and applying software and artistic skills widely used in the video game industry.
          </p>
        </div>
      </span>
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