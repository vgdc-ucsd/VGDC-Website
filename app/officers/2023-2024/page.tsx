import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import Officers, { OfficerDetails } from "../Officers"

// List of officers
const officers: OfficerDetails[] = [
  {
    title: "President",
    name: "Tyler Roache",
    avatar: "/images/officers/2023-2024/TylerRoache.jpg",
    quote:
      "Heyo! My name is Tyler Roache, and I was the President for the 2023-2024 year. I have a Math-CS degree, and am currenting trying to get a job in the game industry! I like making games, talking about them, and going outside to climb and explore (exposure therapy for the grass allergy). If you have any questions feel free to ask away!",
  },
  {
    title: "Vice President",
    name: "Jewelle Tatad",
    avatar: "/images/officers/2023-2024/JewelleTatad.jpg",
    quote: "formerly Co-VP",
  },
  {
    title: "Events Director",
    name: "Carey Yoon",
    avatar: "/images/officers/2023-2024/CareyYoon.jpg",
    quote: "why is he not VP???",
  },
  {
    title: "Treasurer",
    name: "Chase Peterson",
    avatar: "/images/officers/2023-2024/ChasePeterson.jpg",
    quote: "I made this page",
  },
  {
    title: "Marketing Director",
    name: "Killian To",
    avatar: "/images/officers/2023-2024/KillianTo.jpg",
    quote: "formerly known as Ben To",
  },
  {
    title: "Marketing Officer",
    name: "Chanel Lim",
    avatar: "/images/officers/2023-2024/ChanelLim.jpg",
    quote: "soon to be projects lead",
  },
  {
    title: "Marketing Officer",
    name: "Olivia Tsui",
    avatar: "/images/officers/2023-2024/OliviaTsui.jpg",
    quote: "i am a marketing officer!",
  },
  {
    title: "3D Art Director",
    name: "Rodolfo Marquez-Valencia",
    avatar: "/images/officers/2023-2024/RodolfoMarquezValencia.jpg",
    quote: "I am now woman (rodolfo)",
  },
  {
    title: "Outreach Officer",
    name: "Kiichiro Wang",
    avatar: "/images/officers/2023-2024/KiichiroWang.jpg",
    quote: "the next president!",
  },
  {
    title: "Website Director",
    name: "William Kim",
    avatar: "/images/officers/2023-2024/WilliamKim.jpg",
    quote: "I made some other pages!",
  },
  {
    title: "Public Relations Officer",
    name: "Chris Kreins",
    avatar: "/images/officers/2023-2024/ChrisKreins.jpg",
    quote: "I will murder @jewelle",
  },
]

/**
 * Content for the officers page.
 *
 * @returns JSX representation of the officers page.
 */
export default function OfficerPage() {
  return (
    <main className="min-h-screen bg-background-black">
      {/* Display the navbar at the top of the page */}
      <Navbar />

      {/* Page content */}
      <div className="mx-auto max-w-[920px] pb-20 text-white">
        {/* Title section */}
        <div className="mx-6 mb-20 mt-20">
          <Link
            href="./"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back`}</Link>
          <h2 className="mb-3 mt-2 text-4xl font-bold">2023-2024 Officers</h2>
        </div>

        {/* Officers */}
        <Officers officers={officers} />

        {/* Title section */}
        <div className="mx-6 mb-20 mt-20">
          <h2 className="mb-2 mt-2 text-3xl font-medium">Other Years</h2>
          <Link
            href="./"
            className="text-text-grey transition-all hover:text-white"
          >{`Current Officers`}</Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
