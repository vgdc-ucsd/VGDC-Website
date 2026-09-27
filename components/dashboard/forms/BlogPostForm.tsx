"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cx, toSlug, SubmitButton } from "./shared"

const schema = z.object({
  title:        z.string().min(1, "Title is required"),
  subtitle:     z.string().min(1, "Subtitle is required"),
  date:         z.string().min(1, "Date is required"),
  coverImage:   z.any().optional(),
  coverCaption: z.string().optional(),
  slug:         z.string().min(1, "Slug is required"),
  postData:     z.string().min(1, "Content is required"),
})

type Values = z.infer<typeof schema>

export default function BlogPostForm() {
  const [authors, setAuthors] = useState<string[]>([""])

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", subtitle: "", date: "", coverCaption: "", slug: "", postData: "" },
  })

  function onTitleChange(value: string) {
    form.setValue("title", value)
    if (!form.getValues("slug") || form.getValues("slug") === toSlug(form.getValues("title")))
      form.setValue("slug", toSlug(value))
  }

  function onSubmit(_values: Values) {
    //TODO: wire up API route
  }

  return (
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
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} className={cx.file} />
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
                <Textarea {...field} rows={16} placeholder="Write your post in Markdown…" className={`${cx.textarea} resize-y font-mono text-sm`} />
              </FormControl>
              <FormDescription className={cx.hint}>Markdown supported.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <SubmitButton label="Publish Post" />
        </form>
      </Form>
    </div>
  )
}
