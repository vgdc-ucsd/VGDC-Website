import { z } from "zod"
import { BlogPostSchema } from "@/lib/generated/zod/modelSchema/BlogPostSchema"

// Shared by the dashboard BlogPost form (client) and the server action that saves it.
// Only imports zod and the per-model generated schema, so it is safe to bundle for the browser.

const { shape } = BlogPostSchema

export const blogPostFormSchema = z.object({
  title:        shape.title.min(1, "Title is required"),
  subtitle:     shape.subtitle.min(1, "Subtitle is required"),
  // Date input produces a string; convert it to a Date when saving
  date:         z.string().min(1, "Date is required"),
  // File; upload it and save the storage path as `coverImage`
  coverImage:   z.any().optional(),
  coverCaption: shape.coverCaption.unwrap().optional(),
  slug:         shape.slug.min(1, "Slug is required"),
  postData:     shape.postData.min(1, "Content is required"),
})

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>

// Author names from the form's author list. Blank rows (the form starts with one
// empty input) are dropped before checking that at least one author remains.
export const blogPostAuthorsInputSchema = z
  .array(z.string())
  .transform((authors) => authors.map((author) => author.trim()).filter(Boolean))
  .pipe(z.array(shape.authors.element).min(1, "At least one author is required"))

// What the client sends to createBlogPost: the form's fields plus the authors, which live in
// separate state. The type uses z.input, the shape before validation transforms it.
export const blogPostInputSchema = blogPostFormSchema.extend({
  authors: blogPostAuthorsInputSchema,
})

export type BlogPostInput = z.input<typeof blogPostInputSchema>
