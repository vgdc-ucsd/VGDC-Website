import { z } from "zod"
import { EventSchema } from "@/lib/generated/zod/modelSchema/EventSchema"

// Shared by the dashboard Event form (client) and the server action that saves it.
// Only imports zod and the per-model generated schema, so it is safe to bundle for the browser.

const { shape } = EventSchema

export const eventFormSchema = z.object({
  name:        shape.name.min(1, "Name is required"),
  location:    shape.location.min(1, "Location is required"),
  // Date/time inputs produce strings; convert them to Dates when saving
  date:        z.string().min(1, "Date is required"),
  startTime:   z.string().min(1, "Start time is required"),
  endTime:     z.string().min(1, "End time is required"),
  description: shape.description.min(1, "Description is required"),
  // Files; upload them and save the storage paths as `image` / `gallery`
  coverImage:  z.any().optional(),
  gallery:     z.any().optional(),
  slug:        shape.slug.min(1, "Slug is required"),
})

export type EventFormValues = z.infer<typeof eventFormSchema>
