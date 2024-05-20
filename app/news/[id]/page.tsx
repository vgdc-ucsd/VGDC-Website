import React, { useContext } from 'react';
import { generateNeighbors, getPostData } from "@/lib/post"
import ReactMarkdown from 'react-markdown'
import { parseISO, format } from 'date-fns';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import { headers } from "next/headers";
import TwitterButton from "@/components/ui/twitter-button";
import { notFound } from "next/navigation";
import BackButton from "@/components/ui/back-button";

/**
 * This page holds the content for a 
 * specific blog post. It fetches the id of the 
 * blog from the URL params and then fetches the 
 * file contents using getPostData()
 * 
 * ReactMarkdown is then used to display the 
 * blog content. 
 */

{/* test meta tags
<meta property="og:site_name" content="Video Game Development Club" />
<meta property="og:title" content={post.title} />
<meta property="og:description" content={post.excerpt} />
<meta property="og:url" content={testfullpath}/>
<meta property="og:type" content="article" />
<meta property="og:image" content={`${testhostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="640" />

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:site" content ="@vgdc"/>
<meta property="twitter:title" content={post.title}/>
<meta property="twitter:description" content = {post.excerpt} />
<meta property="twitter:image" content={`${testhostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
 */}




export default async function BlogPage({ params}: { params: { id: string }}) {

    const post = await getPostData(params.id);
    
    const {previousPost, nextPost} = await generateNeighbors(params.id)

    if (post == null){
        notFound();
    }

    const avatar = createAvatar(notionistsNeutral, {
        seed: post!.author,
        radius: 50,
        size: 24
    }).toDataUriSync();

    // grab full url path 
    const headerList = headers();
    const fullpath = headerList.get("x-current-path");
    const hostname = headerList.get("x-host-name");
    
    // For testing purposes only. Replace with your custom forwarded host
    const testfullpath = `https://56a4-2600-1700-7c01-1380-301b-91f5-2629-245b.ngrok-free.app/news/${post.id}`
    const testhostname = 'https://56a4-2600-1700-7c01-1380-301b-91f5-2629-245b.ngrok-free.app'

    return (
        <main className="min-h-screen bg-background-black">
            <Navbar />
            
            <head>
                <meta property="og:site_name" content="Video Game Development Club" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:url" content={fullpath!}/>
                <meta property="og:type" content="article" />
                <meta property="og:image" content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
                <meta property="og:image:width" content="1280" />
                <meta property="og:image:height" content="640" />
                
                {/** metadata to define content for twitter previews */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:site" content ="@vgdc"/>
                <meta property="twitter:title" content={post.title}/>
                <meta property="twitter:description" content = {post.excerpt} />
                <meta property="twitter:image" content={`${hostname}/_next/image?url=/images/blogs/${post.id}${post.coverImage}&w=828&q=75`} />
            </head>


            <div className="mx-auto max-w-[920px] pb-20 text-white mt-6 md:mt-20 flex-col flex md:flex-row justify-center">


                <div id="socialShares" className="sticky left-0 top-0 mr-20 md:block mx-6 mb-4">
                    <BackButton/>
                </div>


                <article className=" mx-6 align-middle">

                    {/**Blog MetaData */}
                    <div className="text-text-grey flex w-full flex-row justify-between mb-8">

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
                        <TwitterButton url = {testfullpath} post = {post}/>
                    </div>

                    {/**Cover Image */}
                    <Image
                        src={`/images/blogs/${post.id}${post.coverImage}`}
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
                    <ReactMarkdown className="text-text-grey mt-12 text-sm md:text-base">{post.content}</ReactMarkdown>
                    {/** Section to view more blog posts */}
                    
                    <section className = "mt-16">
                        <hr></hr>
                        <h2 className="text-2xl font-bold text-white mt-4">Read more</h2>

                        <div className = "mt-4 flex justify-between w-full">
                            <div className="flex items-center mr-8">
                                {previousPost && (
                                    <Link href={`/news/${previousPost.id}`}>
                                        <p className="text-white text-sm mr-2">Previous</p>
                                        <p className="text-white">{previousPost.title}</p>
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center ml-auto">
                                {nextPost && (
                                    <Link href={`/news/${nextPost.id}`}>
                                        <p className="text-white text-sm mr-2">Next</p>
                                        <p className="text-white">{nextPost.title}</p>
                                    </Link>
                                )}
                            </div> 

                        </div>
                        
                                 

                    </section>
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


