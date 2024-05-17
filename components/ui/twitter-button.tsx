'use client'
import { Post } from '@/lib/post'
import {
    TwitterShareButton,
    TwitterIcon,
    
  } from 'next-share'
  
export default function TwitterButton({url, post}: {url:string, post: Post}) {
    return (
        <TwitterShareButton
            url={url!}
            
            >
            <TwitterIcon size={32} round />
        </TwitterShareButton>
    )
}