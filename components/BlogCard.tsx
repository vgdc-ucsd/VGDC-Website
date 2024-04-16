import { Button } from "@/components/ui/button";
import { Post } from "@/lib/post";
import Image from "next/image";
import Link from "next/link";


export default function BlogCard({post}:{post:Post}) {
    return(
        <section className = "text-white bg-background-grey p-4 w-full rounded-lg">
             <Image
                src={post.coverImage}
                width={600}
                height={600}
                alt="Picture of the author"
            />
            <h2 className = "text-white text-xl  font-bold">{post.title}</h2>
            <p>By {post.author}</p>
            <p className = "truncate text-ellipsis overflow-hidden ">{post.content}</p>

            <Link href = {post.id}>
                <Button>view</Button>
            </Link>
            
        </section>
    )
}