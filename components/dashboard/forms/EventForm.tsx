"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cx, toSlug, TagInput, SubmitButton, type Tag } from "./shared"

const schema = z.object({
  name:        z.string().min(1, "Name is required"),
  location:    z.string().min(1, "Location is required"),
  date:        z.string().min(1, "Date is required"),
  startTime:   z.string().min(1, "Start time is required"),
  endTime:     z.string().min(1, "End time is required"),
  description: z.string().min(1, "Description is required"),
  coverImage:  z.any().optional(),
  gallery:     z.any().optional(),
  slug:        z.string().min(1, "Slug is required"),
})

type Values = z.infer<typeof schema>

export default function EventForm() {
  const [tags, setTags] = useState<Tag[]>([])

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", location: "", date: "", startTime: "", endTime: "", description: "", slug: "" },
  })

  function onNameChange(value: string) {
    form.setValue("name", value)
    if (!form.getValues("slug") || form.getValues("slug") === toSlug(form.getValues("name")))
      form.setValue("slug", toSlug(value))
  }

  function onSubmit(_values: Values) {
    // TODO: wire up API route
  }

  return (
    <div className={cx.card}>
      <h3 className="mb-6 text-xl font-bold text-white">Add Event</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Event Name</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Game Jam Spring 2025" className={cx.input} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. PC East Ballroom" className={cx.input} />
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

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="startTime" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Start Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="endTime" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>End Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="Describe the event…" className={cx.textarea} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <TagInput type="event" tags={tags} onChange={setTags} />

          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. game-jam-spring-2025" className={cx.input} />
              </FormControl>
              <FormDescription className={cx.hint}>Auto-generated from the event name. Used in the URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="coverImage" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Cover Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} className={cx.file} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="gallery" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Gallery Images</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" multiple onChange={(e) => field.onChange(e.target.files)} className={cx.file} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <SubmitButton label="Submit Event" />
        </form>
      </Form>
    </div>
  )
}
