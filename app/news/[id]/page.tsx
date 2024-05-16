import { Post, getPostData } from "@/lib/post"
import ReactMarkdown from 'react-markdown'
import { parseISO, format } from 'date-fns';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
/**
 * This page holds the content for a 
 * specific blog post. It fetches the id of the 
 * blog from the URL params and then fetches the 
 * file contents using getPostData()
 * 
 * ReactMarkdown is then used to display the 
 * blog content. 
 */




export default async function Page({ params }: { params: { id: string } }) {
    const post = await getPostData(params.id);

    const avatar = createAvatar(notionistsNeutral, {
        seed: post.author,
        radius: 50,
        size: 24
    }).toDataUriSync();



    return (
        <main className="min-h-screen bg-background-black">
            <Navbar />

            <div className="mx-auto max-w-[920px] pb-20 text-white mt-6 md:mt-20 flex-col flex md:flex-row justify-center">


                <div id="socialShares" className="sticky left-0 top-0 mr-20 md:block mx-6 mb-4">
                    <Link href="/">
                        <Button>Back</Button>
                    </Link>
                </div>


                <article className=" mx-6 align-middle">

                    {/**Blog MetaData */}
                    <div className="text-text-grey flex w-full flex-row justify-between md:w-2/3 mb-8">

                        <div className="flex flex-row align-middle">
                            <img
                                src={avatar}
                                className="w-8 mr-2"
                                alt="author cover image"
                            />
                            <div>
                                <p className="text-sm">{post.author}</p>
                                    {/* <p className="text-xs sm:text-sm">{calculateReadingTime(post.content)} Min Read</p>  */}
                                    <DateFormat dateString={post.date} />
                            </div>

                        </div>
                    </div>

                    {/**Cover Image */}
                    <Image
                        src={post.coverImage}
                        width={800}
                        height={600}
                        alt="Cover Image"
                        style={{
                            objectFit: "cover",
                            borderRadius: "16px",
                            height: '40vh',
                            width: '100%',
                        }}
                    />

                    <h1 className="text-3xl md:text-5xl mt-4 mb-2 font-extrabold text-white">{post.title}</h1>


                    {/**Blog Content */}
                    <ReactMarkdown className="text-text-grey mt-4 text-sm md:text-base">{post.content}</ReactMarkdown>

                </article>
            </div>
        </main>

    );
}

function DateFormat({ dateString }: { dateString: string }) {
    const date = parseISO(dateString);
    return (<time className="text-text-grey text-xs sm:text-sm" dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>);
}

function calculateReadingTime(content: string) {
    const wordsPerMinute = 200; // Adjust according to your audience's reading speed
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
}


