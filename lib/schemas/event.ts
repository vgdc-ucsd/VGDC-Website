import { z } from "zod"
import { EventSchema } from "@/lib/generated/zod/modelSchema/EventSchema"
import { EventTagsSchema } from "@/lib/generated/zod/modelSchema/EventTagsSchema"

// Shared by the dashboard Event form (client) and the server action that saves it.
// Only imports zod and the per-model generated schema, so it is safe to bundle for the browser.

const { shape } = EventSchema

export const eventFormSchema = z.object({
  name:        shape.name.min(1, "Name is required"),
  location:    shape.location.min(1, "Location is required"),
  // The form collects one date and two times (what <input type="date"> and
  // <input type="time"> produce). The server combines them into the model's
  // startTimestamp / endTimestamp as Pacific time; an end time earlier than the
  // start time means the event ends the next day.
  date:        z.string().min(1, "Date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime:   z.string().min(1, "Start time is required").regex(/^\d{2}:\d{2}$/, "Start time must be HH:mm"),
  endTime:     z.string().min(1, "End time is required").regex(/^\d{2}:\d{2}$/, "End time must be HH:mm"),
  description: shape.description.min(1, "Description is required"),
  // Storage paths returned by /api/images, saved as the model's `image` / `gallery`.
  // The model allows no cover image (`image String?`), but the form requires one.
  coverImage:  shape.image.unwrap().min(1, "Cover image is required"),
  gallery:     shape.gallery,
  slug:        shape.slug.min(1, "Slug is required"),
})

export type EventFormValues = z.infer<typeof eventFormSchema>

// A tag chosen in the form. It has no id yet: existing tags are matched by text when saving.
export const eventTagInputSchema = EventTagsSchema.omit({ id: true }).extend({
  text: EventTagsSchema.shape.text.trim().min(1, "Tag text is required"),
})

export type EventTagInput = z.infer<typeof eventTagInputSchema>

// What the client sends to createEvent: the form's fields plus the tags, which live in
// separate state. The type uses z.input, the shape before validation transforms it.
export const eventInputSchema = eventFormSchema.extend({
  tags: z.array(eventTagInputSchema),
})

export type EventInput = z.input<typeof eventInputSchema>
