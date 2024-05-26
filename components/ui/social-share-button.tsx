'use client'
import { Post } from '@/lib/post'
import { LinkedinIcon } from 'lucide-react'
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    
  } from 'next-share'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
  
const socialIconStyle = "mx-2 hover:text-vgdc-light-blue transition ease-in duration-150 "
export default function SocialShareButton({url, network,post}: {url:string, network:string, post: Post}) {
    return (
        <>
        {network == "twitter" && 
            <TwitterShareButton url={url!}>
                <FaTwitter size={24} className = {socialIconStyle} />
            </TwitterShareButton>
        }
        {network == "facebook" && 
            <FacebookShareButton url={url!}>
                <FaFacebook size={24} className = {socialIconStyle} />
            </FacebookShareButton>
        }
        {network == "linkedin" && 
            <LinkedinShareButton url={url!}>
                <FaLinkedin size={24} className = {socialIconStyle} />
            </LinkedinShareButton>
        }
        </>
        
    )
}