import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar'
import { Post, getSortedPostsData } from '@/lib/post';

export default async function News() {
  const posts = await getSortedPostsData(0);

  return (

    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto max-w-[920px] pb-20 text-white">
        {/* Title section */}
        <div className="mx-6 mb-20 mt-20">
          <h2 className="mb-3 mt-2 text-4xl font-bold">VGDC News</h2>

        </div>
     
      <div className="mx-6 flex-start flex flex-wrap justify-center gap-12">
        {posts.map((post:Post, index)=> {
          return (
          <BlogCard post = {post}/>
          )
        })}
      </div>
      </div>
    </main>
  )
}
