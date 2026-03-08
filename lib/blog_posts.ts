import { getStoredImageUrl } from "./images"
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

export async function getBlogPostsData() : Promise<Result<BlogPostData[]>> {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: "desc" }
    });

    if (!blogPosts) return { ok: false, error: "Failed to get blog posts" }

    const resultPromises = blogPosts.map(async (post) => {
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
      } satisfies BlogPostData;
    });

    return {
      ok: true,
      data: await Promise.all(resultPromises)
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}
