"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gameFormSchema, type GameFormValues, type GameTagInput } from "@/lib/schemas/game"
import { cx, TagInput, SubmitButton } from "./shared"
import { ImageUploadInput } from "./ImageUploadInput"
import { createGame } from "@/lib/form-actions"

export default function GameForm() {
  const [tags, setTags] = useState<GameTagInput[]>([])
  const [uploadPending, setUploadPending] = useState(false);

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: { title: "", credits: "", description: "", releaseDate: "", status: "UNRELEASED", difficulty: 1, isWebPlayable: false, hasSeal: false, link: "" },
  })

  async function onSubmit(values: GameFormValues) {
    form.clearErrors("root");
    const result = await createGame({...values, tags});
    if (!result.ok) {
      form.setError(result.field ?? "root", { message: result.error });
      return;
    }
    form.reset();
    setTags([]);
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

          <TagInput type="game" tags={tags} onChange={setTags} />

          <FormField control={form.control} name="thumbnail" render={({ field }) => (
            <FormItem>
              <FormLabel className={cx.label}>Thumbnail</FormLabel>
              <FormControl>
                <ImageUploadInput 
                  folder="games" 
                  multiple={false}
                  paths={field.value ? [field.value] : []}
                  onUploaded={([path]) => field.onChange(path)}
                  onError={(message) => form.setError("thumbnail", { message })}
                  onBusyChange={(busy) => {
                    if (busy) form.clearErrors("thumbnail")
                    setUploadPending(busy)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Errors from createGame that don't belong to a specific field */}
          {form.formState.errors.root && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <SubmitButton label="Submit Game" disabled={uploadPending || form.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  )
}
