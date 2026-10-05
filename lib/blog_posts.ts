import type { BlogPost } from "@/lib/generated/prisma/client"
import { getStoredImageUrl } from "./images.server"
import { prisma } from "./prisma"
import { Result } from "./utils"

export type BlogPostData = {
  title: string
  date: string
  authors: string
  subtitle: string
  coverImage?: string
  coverCredit?: string
  content: string
  slug: string
}

export type BlogPostLink = {
  title: string
  slug: string
}

async function toBlogPostData(post: BlogPost): Promise<BlogPostData> {
  const coverImageURL = post.coverImage
    ? await getStoredImageUrl(post.coverImage)
    : undefined;

  return {
    title: post.title,
    date: post.date.toLocaleDateString(),
    authors: post.authors.join(", "),
    subtitle: post.subtitle,
    coverImage: coverImageURL,
    coverCredit: post.coverCaption ?? undefined,
    content: post.postData,
    slug: post.slug,
  };
}

/**
 * Gets blog posts ordered newest first.
 * @param limit the maximum number of posts to return, or all posts if omitted
 */
export async function getBlogPostsData(limit?: number) : Promise<Result<BlogPostData[]>> {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: "desc" },
      take: limit
    });

    if (!blogPosts) return { ok: false, error: "Failed to get blog posts" }

    return {
      ok: true,
      data: await Promise.all(blogPosts.map(toBlogPostData))
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}

export async function getBlogPostData(slug: string) : Promise<Result<BlogPostData>> {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!blogPost) return { ok: false, error: "Blog post not found" }

    return { ok: true, data: await toBlogPostData(blogPost) };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}

/**
 * Gets the posts adjacent to the given slug, ordered newest first.
 * previousPost is the newer post, nextPost is the older post.
 */
export async function getBlogPostNeighbors(slug: string) : Promise<Result<{
  previousPost: BlogPostLink | null
  nextPost: BlogPostLink | null
}>> {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: "desc" },
      select: { title: true, slug: true }
    });

    const index = blogPosts.findIndex((post) => post.slug === slug);
    if (index === -1) return { ok: false, error: "Blog post not found" }

    return {
      ok: true,
      data: {
        previousPost: blogPosts[index - 1] ?? null,
        nextPost: blogPosts[index + 1] ?? null,
      }
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}
