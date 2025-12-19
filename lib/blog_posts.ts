import { GetStoredImageUrl } from "./images"
import { prisma } from "./prisma"

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

export async function getBlogPostsData() {
  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { date: "desc" }
  });

  const resultPromises = blogPosts.map(async (post) => {
    const coverImageURL = post.coverImage
      ? await GetStoredImageUrl(post.coverImage)
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

  return await Promise.all(resultPromises);
}
