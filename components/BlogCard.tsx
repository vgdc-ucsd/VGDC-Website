import { Button } from "@/components/ui/button";
import { Post } from "@/lib/post";
import Image from "next/image";
import Link from "next/link";
import styles from './BlogCard.module.css'; // Import your CSS file


export default function BlogCard({post}:{post:Post}) {
    return(
        <section className = "flex-col md:flex-row items-start text-white h-fit w-full rounded-lg flex mb-8 pt-4  " >
           
           <div className = "pb-4">

           <Image
                src={post.coverImage}
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
                <h2 className = "text-base font-bold text-white md:text-xl lg:text-3xl">{post.title}</h2>
                <p className = "text-text-grey text-base font-bold xl:text-lg mt-2">By {post.author}</p>
                <p className = {`${styles['clamped-lines']} text-text-grey mt-4 max-w-lg text-sm sm:text-base xl:text-lg` } >{post.content}</p>

                <Link href = {post.id} >
                    <Button className = "mt-4">view</Button>
                </Link>

            </div>
            
            
        </section>
    )
}