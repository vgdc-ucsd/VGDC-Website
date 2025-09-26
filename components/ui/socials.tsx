"use client"

import { SiMinutemailer } from "react-icons/si"
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa"

interface SocialsProps {
  variant?: "hero" | "footer"
  className?: string
}

const socialLinks = [
  {
    href: "https://www.instagram.com/vgdc.at.ucsd/",
    icon: FaInstagram,
    size: 32,
    label: "Instagram"
  },
  {
    href: "https://bit.ly/VGDCUCSD",
    icon: FaDiscord,
    size: 32,
    label: "Discord"
  },
  {
    href: "mailto:vgdc@ucsd.edu",
    icon: SiMinutemailer,
    size: 28,
    label: "Email"
  }
];

export default function Socials({ variant = "hero", className = "" }: SocialsProps) {
  return (
    <div className={`${className}`}>
      <h4 className='text-xl text-text-white text-center'>
        Follow us and stay connected!
      </h4>
      <div className={`mt-4 flex w-40 flex-row justify-between mx-auto ${variant === 'footer' ? '' : ''}`}>
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
          >
            <social.icon className='text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink' size={social.size} />
          </a>
        ))}
      </div>
    </div>
  )
}
