import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import Officers, { OfficerDetails } from "../Officers"

// List of officers
// const officers: OfficerDetails[] = [
//   {
//     title: "President",
//     name: "Tyler Roache",
//     avatar: "/images/officers/2023-2024/TylerRoache.jpg",
//     quote:
//       "Heyo! My name is Tyler Roache, and I was the President for the 2023-2024 year. I have a Math-CS degree, and am currenting trying to get a job in the game industry! I like making games, talking about them, and going outside to climb and explore (exposure therapy for the grass allergy). If you have any questions feel free to ask away!",
//   },
//   {
//     title: "Vice President",
//     name: "Jewelle Tatad",
//     avatar: "/images/officers/2023-2024/JewelleTatad.jpg",
//     quote: "formerly Co-VP",
//   },
//   {
//     title: "Events Director",
//     name: "Carey Yoon",
//     avatar: "/images/officers/2023-2024/CareyYoon.jpg",
//     quote: "why is he not VP???",
//   },
//   {
//     title: "Treasurer",
//     name: "Chase Peterson",
//     avatar: "/images/officers/2023-2024/ChasePeterson.jpg",
//     quote: "I made this page",
//   },
//   {
//     title: "Marketing Officer",
//     name: "Chanel Lim",
//     avatar: "/images/officers/2023-2024/ChanelLim.jpg",
//     quote: "soon to be projects lead",
//   },
//   {
//     title: "Marketing Officer",
//     name: "Olivia Tsui",
//     avatar: "/images/officers/2023-2024/OliviaTsui.jpg",
//     quote: "i am a marketing officer!",
//   },
//   {
//     title: "3D Art Director",
//     name: "Rodolfo Marquez-Valencia",
//     avatar: "/images/officers/2023-2024/RodolfoMarquezValencia.jpg",
//     quote: "I am now woman (rodolfo)",
//   },
//   {
//     title: "Outreach Officer",
//     name: "Kiichiro Wang",
//     avatar: "/images/officers/2023-2024/KiichiroWang.jpg",
//     quote: "the next president!",
//   },
//   {
//     title: "Public Relations Officer",
//     name: "Chris Kreins",
//     avatar: "/images/officers/2023-2024/ChrisKreins.jpg",
//     quote: "I will murder @jewelle",
//   },
// ]

// List of officers
const officers: OfficerDetails[] = [
  {
    title: "President",
    name: "Tyler Roache",
    avatar: "/images/officers/placeholders/doug.png",
    quote:
      "Heyo! My name is Tyler Roache, and I was the President for the 2023-2024 year. I have a Math-CS degree, and am currenting trying to get a job in the game industry! I like making games, talking about them, and going outside to climb and explore (exposure therapy for the grass allergy). If you have any questions feel free to ask away!",
  },
  {
    title: "Vice President & Events Director",
    name: "Carey Yoon",
    avatar: "/images/officers/placeholders/cici.png",
    quote: "why is he not VP???",
  },
  {
    title: "Vice President",
    name: "Jewelle Tatad",
    avatar: "/images/officers/placeholders/vivi.png",
    quote: "",
  },
  {
    title: "Vice President",
    name: "Breanna Lau",
    avatar: "/images/officers/2024-2025/breanna-lau.jpg",
    quote:
      "Hey y'all, Breanna here! I'm a 2nd-year majoring in ICAM (art focus) hoping to break into character design, cinematography, worldbuilding, and narrative in games! I love drawing, singing, staying fit in interesting ways, anime, and ofc gaming. Hmu on Discord @breagle and follow my art acc @breagle.art on Insta to see my work <3",
  },
  {
    title: "Marketing Director",
    name: "Killian To",
    avatar: "/images/officers/placeholders/gigi.png",
    quote: "formerly known as Ben To",
  },
  {
    title: "Projects Director",
    name: "Chanel Lim",
    avatar: "/images/officers/placeholders/vivi.png",
    quote:
      "HII 🫶 My name is Chanel, I'm a 4th year ICAM major! I'm currently the Projects Director for the club. Reach out to me about anything! I love Disco Elysium, Hades, Celeste, and Hollow Knight. You can always find me drawing ✍️ and chronically online @prima on discord!",
  },
  {
    title: "Outreach & PR Director",
    name: "Chris Kreins",
    avatar: "/images/officers/2024-2025/chris-kreins.jpg",
    quote:
      "Hi! My name is Chris and im a 3rd year studying Business Psychology with a minor in Computational Social Science. I'm a big fan of Stardew Valley and Destiny 2 and I often spend my time either gaming or serving our awesome UCSD community :). If you catch me around our gaming space or even where I work at Eleanor Roosevelt College, feel free to say hi!",
  },
  {
    title: "Treasurer",
    name: "Chase Peterson",
    avatar: "/images/officers/2024-2025/chase-peterson.jpg",
    quote:
      "Hey! I'm Chase, a Computer Science and Music double major. I built this site with William Kim, including the page you're looking at right now! If you wanna talk or hang out definitely feel free to reach out, my Discord is @cepeters and I'm always down to meet new people :)",
  },
  {
    title: "Website Director",
    name: "William Kim",
    avatar: "/images/officers/placeholders/doug.png",
    quote: "I made some other pages!",
  },
  {
    title: "3D Art Director",
    name: "Rodolfo Marquez-Valencia",
    avatar: "/images/officers/placeholders/cici.png",
    quote: "I am now woman (rodolfo)",
  },
  {
    title: "Marketing Officer",
    name: "Olivia Tsui",
    avatar: "/images/officers/placeholders/gigi.png",
    quote: "Hello! I'm Olivia and I'm the Marketing Director for VGDC :O",
  },
  {
    title: "Marketing Officer",
    name: "Sofia Nguyen",
    avatar: "/images/officers/2024-2025/sofia-nguyen.jpg",
    quote:
      "Heyo! My name is Sofia, I'm a Computer Science major with a minor in ICAM.  I love puzzles, manga, and reading. I am trying to learn game development and piano in my free time.",
  },
  {
    title: "Marketing Officer",
    name: "Kevin Tang",
    avatar: "/images/officers/placeholders/gigi.png",
    quote: "",
  },
  {
    title: "Marketing Officer",
    name: "Zee Avila",
    avatar: "/images/officers/placeholders/cici.png",
    quote:
      "Hi! My name is Zee, I'm a second year majoring in ICAM and I'm a new Marketing officer with a focus on design. ",
  },
  {
    title: "Events Officer",
    name: "Aslan Chan",
    avatar: "/images/officers/2024-2025/aslan-chan.jpg",
    quote:
      "Hii! I'm Aslan, 2nd year CS major. I'm the Events Director and am hoping to organize some really cool events for you guys. In terms of game dev, I mainly enjoy programming and maybe a little game design. In general, I love playing volleyball, working out and playing tetris.",
  },
  {
    title: "Events Officer",
    name: "Ethan Schwartzman",
    avatar: "/images/officers/2024-2025/ethan-schwartzman.jpg",
    quote:
      "Hi! I'm Ethan, a 2nd-year CS major with a minor in ICAM music. I enjoy programming, game design, and composing original music for VGDC!",
  },
  {
    title: "Events Officer",
    name: "Adian Averett",
    avatar: "/images/officers/placeholders/vivi.png",
    quote: "",
  },
  {
    title: "Events Officer",
    name: "Andrew Khov",
    avatar: "/images/officers/2024-2025/andrew-khov.jpg",
    quote:
      "Yo! My name is Andrew, I'm a Math-CS 2nd-year (incoming 3rd year)  hoping to get into whatever interests me in the tech field like game development :) I am currently an events officer and I hope we'll be able to make and do some really cool shit together. I'll be around watching anime, working out, and gaming.",
  },
  {
    title: "Marketing Officer",
    name: "Mirae Lee",
    avatar: "/images/officers/placeholders/gigi.png",
    quote:
      "Hihi! I'm a 3rd year Psych major and CogSci minor. I'm a new officer but I want to get into making more graphics and game UI/UX, so I look forward to growing with the club this year!",
  },
  {
    title: "PR Officer",
    name: "Joshua Nolasco",
    avatar: "/images/officers/2024-2025/joshua-nolasco.jpg",
    quote:
      "Hey ya! I'm Josh, an incoming 2nd-year Business Economics major and a new PR Officer for VGDC. I love games, films, art, animation, and hitting the gym. Hit me up at @jashnola on discord!",
  },
  {
    title: "Outreach Officer",
    name: "Kiichiro Wang",
    avatar: "/images/officers/2024-2025/kiichiro-wang.jpg",
    quote:
      "HIYA!! I'm Kiichi, a 3rd year ICAM Major and CS minor and the president for the upcoming 2024-2025 year. I love dabbling in a little bit of everything like digital art, game programming, game production, drums, and archery. I'm super stoked to be working on some future events and projects so I hope I see y'all then :D",
  },
  {
    title: "Outreach Officer",
    name: "Annie Wong",
    avatar: "/images/officers/placeholders/vivi.png",
    quote: "",
  },
  {
    title: "Outreach Officer",
    name: "Arihant Jain",
    avatar: "/images/officers/placeholders/gigi.png",
    quote: "",
  },
  {
    title: "Outreach Officer",
    name: "Gabriel Ikezaki",
    avatar: "/images/officers/placeholders/cici.png",
    quote:
      "Hey. I'm Gabriel, a 4th year CS major. I enjoy drawing, playing games, practicing martial arts and talking about weird media on my spare time. Joining the VGDC this year, and I hope to meet new people!",
  },
  {
    title: "Outreach Officer",
    name: "Ryan Fordham",
    avatar: "/images/officers/placeholders/doug.png",
    quote: "",
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
        <div className="mx-8 mb-20 mt-20">
          <Link
            href="./"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back`}</Link>
          <h2 className="mb-3 mt-2 text-4xl font-bold">2023-2024 Officers</h2>
          <p className="max-w-[600px] text-lg leading-6">
            {`VGDC grew dramatically in the 2023-2024 year, with a new team led by Tyler Roache.
            Events, led by Carey Yoon, more than tripled in attendance, and the whole club came
            together to build Athenaeum as part of The Chanel Project, led by Chanel Lim. In the
            Spring, Kiichiro Wang took over as President and more than doubled the size of the 
            board in preparation for the next year.`}
          </p>
        </div>

        {/* Officers */}
        <Officers officers={officers} />

        {/* Other Years */}
        <div className="mx-8 mb-20 mt-20">
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
