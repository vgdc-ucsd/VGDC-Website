import { z } from "zod"
import { GameSchema } from "@/lib/generated/zod/modelSchema/GameSchema"
import { GameTagsSchema } from "@/lib/generated/zod/modelSchema/GameTagsSchema"

// Shared by the dashboard Game form (client) and the server action that saves it.
// Only imports zod and the per-model generated schema, so it is safe to bundle for the browser.

const { shape } = GameSchema

export const gameFormSchema = z.object({
  title:         shape.title.min(1, "Title is required"),
  credits:       shape.credits.min(1, "Credits are required"),
  description:   shape.description.min(1, "Description is required"),
  // Date input produces a string; convert it to a Date when saving
  releaseDate:   z.string().min(1, "Release date is required"),
  status:        shape.status,
  // Number inputs produce strings, so coerce before applying the model's int check
  difficulty:    z.coerce.number().pipe(shape.difficulty.min(1).max(5)),
  isWebPlayable: shape.isWebPlayable,
  hasSeal:       shape.hasSeal,
  link:          shape.link.unwrap().optional(),
  // File; upload it and save the storage path as `thumbnail`
  thumbnail:     z.any().optional(),
})

export type GameFormValues = z.infer<typeof gameFormSchema>

// A tag chosen in the form. It has no id yet: existing tags are matched by text when saving.
export const gameTagInputSchema = GameTagsSchema.omit({ id: true }).extend({
  text: GameTagsSchema.shape.text.trim().min(1, "Tag text is required"),
})

export type GameTagInput = z.infer<typeof gameTagInputSchema>

// What the client sends to createGame: the form's fields plus the tags, which live in
// separate state. The type uses z.input, the shape before validation transforms it.
export const gameInputSchema = gameFormSchema.extend({
  tags: z.array(gameTagInputSchema),
})

export type GameInput = z.input<typeof gameInputSchema>
