"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cx, TagInput, SubmitButton, type Tag } from "./shared"

const schema = z.object({
  title:         z.string().min(1, "Title is required"),
  credits:       z.string().min(1, "Credits are required"),
  description:   z.string().min(1, "Description is required"),
  releaseDate:   z.string().min(1, "Release date is required"),
  status:        z.enum(["RELEASED", "PROTOTYPE", "UNRELEASED"]),
  difficulty:    z.coerce.number().min(1).max(5),
  isWebPlayable: z.boolean(),
  hasSeal:       z.boolean(),
  link:          z.string().optional(),
  thumbnail:     z.any().optional(),
})

type Values = z.infer<typeof schema>

export default function GameForm() {
  const [tags, setTags] = useState<Tag[]>([])

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", credits: "", description: "", releaseDate: "", status: "UNRELEASED", difficulty: 1, isWebPlayable: false, hasSeal: false, link: "" },
  })

  function onSubmit(_values: Values) {
    // TODO: wire up API route
  }

  return (
    <div className={cx.card}>
      <h3 className="mb-6 text-xl font-bold text-white">Add Game</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Galactic Drift" className={cx.input} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="credits" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Credits</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="e.g. Design: Alice, Code: Bob" className={cx.textarea} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="Describe the game…" className={cx.textarea} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="releaseDate" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Release Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cx.input}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-white/20 bg-black text-white">
                    <SelectItem value="RELEASED"   className="focus:bg-background-grey focus:text-white">Released</SelectItem>
                    <SelectItem value="PROTOTYPE"  className="focus:bg-background-grey focus:text-white">Prototype</SelectItem>
                    <SelectItem value="UNRELEASED" className="focus:bg-background-grey focus:text-white">Unreleased</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="difficulty" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Difficulty (1–5)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} max={5} className={`${cx.input} w-24`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <FormField control={form.control} name="isWebPlayable" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-vgdc-light-green" />
                </FormControl>
                <FormLabel className={`${cx.label} !mt-0`}>Web Playable</FormLabel>
              </FormItem>
            )} />
            <FormField control={form.control} name="hasSeal" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-vgdc-light-green" />
                </FormControl>
                <FormLabel className={`${cx.label} !mt-0`}>Has VGDC Seal</FormLabel>
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="link" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Play Link <span className="text-text-grey/50">(optional)</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://itch.io/…" className={cx.input} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <TagInput tags={tags} onChange={setTags} />

          <FormField control={form.control} name="thumbnail" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Thumbnail</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} className={cx.file} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <SubmitButton label="Submit Game" />
        </form>
      </Form>
    </div>
  )
}
