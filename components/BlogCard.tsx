import { Button } from "@/components/ui/button";
import { Post } from "@/lib/post";
import Image from "next/image";
import Link from "next/link";
import styles from './BlogCard.module.css'; // Import your CSS file
import ReactMarkdown from 'react-markdown';
import { createAvatar } from "@dicebear/core";
import { notionistsNeutral } from "@dicebear/collection";


export default function BlogCard({post}:{post:Post}) {

    const avatar = createAvatar(notionistsNeutral, {
        seed: post.author,
        radius: 50,
        size: 24
    }).toDataUriSync();
    
    return(
        <section className = "flex-col md:flex-row items-start text-white h-fit w-full rounded-lg flex mb-8 pt-4" >
           
           <div className = "pb-4">

           <Image
                src={`/images/blogs/${post.id}${post.coverImage}`}
                width={600}
                height={600}
                alt="Picture of the author"
                style={{
                    objectFit: "cover",
                    borderRadius: "24px", 
                    height: '250px',
                    width: '380px'
                    }}
            />

           </div>

        
             
            <div className = "pl-4 pb-4">
                <h2 className = "text-2xl font-bold text-white lg:text-2xl">{post.title}</h2>
                <span className = "flex flex-row align-middle mt-2">
                    <img
                        src={avatar}
                        className="w-8 mr-2"
                        alt = "author cover image"
                    />
                    <p className = "text-text-grey text-base font-bold">By {post.author}</p>
                </span>
                <ReactMarkdown className = {`${styles['clamped-lines']} text-text-grey mt-4 max-w-lg text-base` } >{post.content}</ReactMarkdown>

                <Link href = {`news/${post.id}`} >
                    <Button className = "mt-4">view</Button>
                </Link>

            </div>
            
            
        </section>
    )
}