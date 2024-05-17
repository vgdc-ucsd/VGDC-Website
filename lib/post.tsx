import fs from "fs"
import path from "path"
import matter from "gray-matter"

/**
 * Defines the methods to read all the markdown blog posts 
 * inside the ../posts directory and return a list 
 * of Post objects
 */
const postsDirectory = path.join(process.cwd(), "/posts")

export type Post = {
  id: string
  date: string
  title: string
  author: string
  excerpt: string,
  coverImage: string
  content: string
}

export function getSortedPostsData() {
  console.log("getting all posts")
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData: Post[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "")

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Ensure that the required properties exist
    if (!matterResult.data.date || !matterResult.data.title) {
      throw new Error(`Missing date or title in file: ${fileName}`)
    }

    // Combine the data with the id
    return {
      id,
      date: matterResult.data.date,
      title: matterResult.data.title,
      author: matterResult.data.author,
      excerpt: matterResult.data.excerpt,
      coverImage: matterResult.data.coverImage,
      content: matterResult.content,
    }
  })

  // Sort posts by date
  const sortedPosts = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })

  // Return only the two most recent posts
  return sortedPosts.slice(0, 2)
}



export async function getPostData(id: string) {
  
  const fullPath = path.join(postsDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    return null; // Indicate that the file was not found
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);


  // Combine the data with the id
  const data =  {
    id,
    date: matterResult.data.date,
    title: matterResult.data.title,
    author: matterResult.data.author,
    excerpt: matterResult.data.excerpt,
    coverImage: matterResult.data.coverImage,
    content: matterResult.content,

  };

  return data;
}