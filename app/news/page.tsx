import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar'
import { Post, getSortedPostsData } from '@/lib/post';
import Link from 'next/link';

export default async function News() {
  const posts = await getSortedPostsData(0);

  return (

    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto max-w-[920px] pb-20 text-white">
        {/* Title section */}
        <div className="mx-6 mb-20 mt-20">
          <Link
            href="./"
            className="text-text-grey transition-all hover:text-white"
          >{`<- back to home`}</Link>

          <h2 className="mt-2 text-4xl font-bold">VGDC News</h2>

        </div>
     
      <div className="mx-6 flex-start flex flex-wrap justify-center">
        {posts.map((post:Post, index)=> {
          return (
          <BlogCard key={index} post = {post}/>
          )
        })}
      </div>
      </div>

      <Footer/>
    </main>
  )
}
