"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { eventFormSchema, type EventFormValues, type EventTagInput } from "@/lib/schemas/event"
import { cx, toSlug, TagInput, SubmitButton } from "./shared"
import { ImageUploadInput } from "./ImageUploadInput"
import { createEvent } from "@/lib/form-actions"

export default function EventForm() {
  const [tags, setTags] = useState<EventTagInput[]>([])
  const [pendingUploads, setPendingUploads] = useState(0);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { name: "", location: "", date: "", startTime: "", endTime: "", description: "", slug: "", coverImage: "", gallery: [] },
  })

  function onNameChange(value: string) {
    form.setValue("name", value, { shouldDirty: true });
    if (!form.getFieldState("slug").isDirty) {
      form.setValue("slug", toSlug(value));
    }
  }

  async function onSubmit(values: EventFormValues) {
    form.clearErrors("root");
    const result = await createEvent({...values, tags});
    if (!result.ok) {
      form.setError(result.field ?? "root", { message: result.error });
      return;
    }
    form.reset();
    setTags([]);
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
                <ImageUploadInput
                  folder="events"
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

          <FormField control={form.control} name="gallery" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Gallery Images</FormLabel>
              <FormControl>
                <ImageUploadInput 
                  folder="events" 
                  multiple={true}
                  paths={field.value ?? []}
                  onUploaded={(paths) => field.onChange([...(field.value ?? []), ...paths])}
                  onError={(message) => form.setError("gallery", { message })}
                  onBusyChange={(busy) => {
                    if (busy) form.clearErrors("gallery")
                    setPendingUploads((count) => count + (busy ? 1 : -1))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Errors from createEvent that don't belong to a specific field */}
          {form.formState.errors.root && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <SubmitButton label="Submit Event" disabled={pendingUploads > 0 || form.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  )
}
