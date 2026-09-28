import { z } from "zod"
import { GameSchema } from "@/lib/generated/zod/modelSchema/GameSchema"

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
