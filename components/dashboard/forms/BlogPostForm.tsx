"use client"

import { useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/schemas/blog-post"
import { cx, toSlug, SubmitButton, FormRootErrors } from "./shared"
import { ImageUploadInput } from "./ImageUploadInput"
import { createBlogPost } from "@/lib/form-actions"
import ImageFileList from "./ImageFileList"
import { ImageMap, generateUniqueImageName, resolveImageSrc } from "@/lib/blog_images.shared"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { ImageDragDropWrapper } from "./ImageDragDropWrapper"

export default function BlogPostForm() {
  const [authors, setAuthors] = useState<string[]>([""])
  const [pendingUploads, setPendingUploads] = useState(0);
  const [imageMap, setImageMap] = useState<ImageMap>({});
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  const editorRef = useRef(null)

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: { title: "", subtitle: "", date: "", coverCaption: "", slug: "", postData: "" },
  })

  function onTitleChange(value: string) {
    form.setValue("title", value, { shouldDirty: true });
    if (!form.getFieldState("slug").isDirty) {
      form.setValue("slug", toSlug(value));
    }
  }

  function onImagesUploaded(uploaded: { fileName: string; path: string }[]) {
    setImageMap((prev) => {
      const next = { ...prev };
      // Name each one against `next` so files uploaded together don't take the same name
      for (const { fileName, path } of uploaded) next[generateUniqueImageName(fileName, next)] = path;
      return next;
    });
  }

  function onImageRenamed(oldName: string, newName: string) {
    // Rebuild from entries so the image keeps its place in the list
    setImageMap((prev) => Object.fromEntries(
      Object.entries(prev).map(([name, path]) => [name === oldName ? newName : name, path])
    ));
    // Update references in the post so renaming doesn't break them
    const content = form.getValues("postData");
    form.setValue("postData", content.split(`](${oldName})`).join(`](${newName})`), { shouldDirty: true });
  }

  function onImageDeleted(name: string) {
    // The file stays in storage; it's just no longer part of this post
    // TODO: Once the image deletion feature from feat/event-update-delete is
    // moved to its own branch, implement image deletion here.
    setImageMap((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });

    const content = form.getValues("postData");
    form.setValue(
      "postData",
      content
        .split("\n")
        .filter((line) => !line.endsWith(`](${name})`))
        .join("\n"),
      { shouldDirty: true }
    );
  }

  async function onSubmit(values: BlogPostFormValues) {
    form.clearErrors("root");
    const result = await createBlogPost({...values, authors, imageMap});
    if (!result.ok) {
      form.setError(result.field ?? "root", { message: result.error });
      return;
    }
    form.reset();
    setAuthors([""]);
    setImageMap({});
  }

  function onContentChange(newContent: string) {
    form.setValue("postData", newContent, { shouldDirty: true });
  }

  const postData = useWatch({ control: form.control, name: "postData" });

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start min-[1440px]:-ml-[17.5rem]">
      <aside className="lg:sticky lg:top-6">
        <ImageFileList
          imageMap={imageMap}
          onUploaded={onImagesUploaded}
          onBusyChange={(busy) => setPendingUploads((count) => count + (busy ? 1 : -1))}
          onRename={onImageRenamed}
          onDelete={onImageDeleted}
          errors={imageErrors}
          onErrors={setImageErrors}
        />
      </aside>

      <div className={cx.card}>
        <h3 className="mb-6 text-xl font-bold text-white">Write Blog Post</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Title</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => onTitleChange(e.target.value)} placeholder="e.g. Devlog #3: Polishing the Combat System" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="subtitle" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Subtitle</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A short summary shown in the post listing" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Authors */}
            <div className="space-y-2">
              <p className="text-sm text-text-grey">Authors</p>
              <div className="space-y-2">
                {authors.map((author, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={author}
                      onChange={(e) => setAuthors((prev) => prev.map((a, idx) => idx === i ? e.target.value : a))}
                      placeholder={`Author ${i + 1}`}
                      className={cx.input}
                    />
                    {authors.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => setAuthors((prev) => prev.filter((_, idx) => idx !== i))} className={`shrink-0 ${cx.btn}`}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => setAuthors((prev) => [...prev, ""])} className={`text-sm ${cx.btn}`}>
                + Add Author
              </Button>
            </div>

            <FormField control={form.control} name="coverImage" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Cover Image</FormLabel>
                <FormControl>
                  <ImageUploadInput 
                    folder="blogs" 
                    multiple={false}
                    paths={field.value ? [field.value] : []}
                    onUploaded={([path]) => field.onChange(path)}
                    onError={(message) => form.setError("coverImage", { message })}
                    onBusyChange={(busy) => {
                      if (busy) form.clearErrors("coverImage")
                      setPendingUploads((count) => count + (busy ? 1 : -1))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="coverCaption" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Cover Caption <span className="text-text-grey/50">(optional)</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Caption displayed below the cover image" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. devlog-3-combat-system" className={cx.input} />
                </FormControl>
                <FormDescription className={cx.hint}>Auto-generated from the title. Used in the URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="postData" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Content</FormLabel>
                <FormControl>
                  <ImageDragDropWrapper
                    imageMap={imageMap}
                    onUploaded={onImagesUploaded}
                    onBusyChange={(busy) => setPendingUploads((count) => count + (busy ? 1 : -1))}
                    onErrors={setImageErrors}
                    onChange={onContentChange}
                    editorRef={editorRef}
                  >
                    <Textarea {...field} rows={16} placeholder="Write your post in Markdown…" className={`${cx.textarea} resize-y font-mono text-sm`} ref={editorRef}/>
                  </ImageDragDropWrapper>
                </FormControl>
                <FormDescription className={cx.hint}>Markdown supported. Click an image in the list to copy its Markdown.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            {/* Prototype preview: only checks that local image names resolve */}
            {postData && (
              <div className="space-y-2">
                <p className="text-sm text-text-grey">Preview</p>
                <div className="rounded-md bg-black p-4 text-sm text-text-grey space-y-2">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      img: ({ src, alt }) => (
                        <img src={resolveImageSrc(String(src ?? ""), imageMap)} alt={alt ?? ""} className="max-w-full rounded" />
                      ),
                    }}
                  >
                    {postData}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <FormRootErrors formErrors={form.formState.errors} />

            <SubmitButton label="Publish Post" disabled={pendingUploads > 0 || form.formState.isSubmitting} />
          </form>
        </Form>
      </div>
    </div>
  )
}
