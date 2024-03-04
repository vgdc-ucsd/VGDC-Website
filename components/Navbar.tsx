import Image from "next/image";
import Link from "next/link";

/**
 * The navbar for the website, with the logo and navigation.
 * 
 * @returns JSX representation of the navbar.
 */
export default function Navbar() {
	return (
		<>
			<div className="fixed h-20 text-light-grey w-full font-light backdrop-blur-lg bg-background-black/30">
				<div className="relative w-full px-8 py-4">
					<Link href="./" className="absolute w-fit block top-4" >
						<Image src="/logos/VGDC-logo-no-subtitle.png" alt="VGDC Logo" width={300} height={780} className="cursor-pointer w-32" />
					</Link>
					<div className="relative align-middle space-x-20 mx-auto w-fit text-2xl top-3">
						<Link href="./">Home</Link>
						<Link href="./officers">Team</Link>
						<Link href="./events">Events</Link>
						<Link href="./news">News</Link>
					</div>
				</div>
			</div>
			<div className="pointer-events-none h-20 " />
		</>
		
	);
}
