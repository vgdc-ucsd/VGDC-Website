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
			<div className="fixed h-20 text-vgdc-light-green w-full backdrop-blur-lg bg-background-black/30">
				<Link href="./" className="absolute top-2 left-2 cursor-wait" >
					<Image src="/logos/VGDC-logo.png" alt="VGDC Logo" width={380} height={780} className="cursor-pointer w-36" />
				</Link>
			</div>
			<div className="pointer-events-none h-20 " />
		</>
		
	);
}
