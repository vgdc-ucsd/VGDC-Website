import Navbar from "@/components/Navbar";
import EventList from "@/components/EventList";
import Contributors from "@/components/Contributors";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";

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
	return <></>;
}

function Companies() {
	return <></>;
}

function About() {
	const socialLinkStyle =
		"text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink";

	return (
		<section className="flex items-center flex-col w-auto mx-4 py-12">
			<h2 className=" text-white font-bold text-md md:text-xl lg:text-3xl">
				What is VGDC?
			</h2>

			<div className="flex items-center flex-col mt-4">
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>TR</AvatarFallback>
				</Avatar>

				<div className="text-center">
					<p className="text-white font-bold text-xs mt-2">President</p>
					<p className="text-white text-xs">Tyler Roache</p>
					<p className="text-text-grey text-xs md:text-sm max-w-md my-0 mt-3">
						VGDC is a student-run organization at UCSD dedicated to teaching and
						applying software and artistic skills widely used in the video game
						industry.
					</p>
				</div>

				<span className="flex flex-row justify-between w-56 mt-4 align-center">
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
	);
}

function Engagement() {
	return <></>;
}

function Niches() {
	return <></>;
}

function Games() {
	return <></>;
}
