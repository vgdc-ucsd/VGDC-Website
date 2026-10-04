"use server"

import { auth } from "@/lib/auth";
import { EventFormValues, EventInput, eventInputSchema } from "@/lib/schemas/event";
import moment from "moment-timezone";
import { Timezone } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ImageFolder } from "@/lib/images.shared";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

export type FormActionResult = 
  | { ok: true; }
  | { ok: false, error: string; field?: keyof EventFormValues };

const TIME_FORMAT = "YYYY-MM-DD HH:mm";

const validateImagePath = (folder: ImageFolder) =>
  z.string().regex(
    new RegExp(
      `^${folder}/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(png|jpeg|webp|gif|avif)$`,
    ),
    "Invalid image path",
  );

export async function createEvent(input: EventInput): Promise<FormActionResult> {
  const session = await auth();
  if (!session) return { ok: false, error: "You must be signed in as an officer to create an event" };

  const parsed = eventInputSchema.extend({
    coverImage: validateImagePath("events"),
    gallery: z.array(validateImagePath("events")),
  }).safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: issue.path[0] as keyof EventFormValues };
  }
  const values = parsed.data;

  const startTimestamp = moment.tz(`${values.date} ${values.startTime}`, TIME_FORMAT, true, Timezone);
  const endTimestamp = moment.tz(`${values.date} ${values.endTime}`, TIME_FORMAT, true, Timezone);
  if (!startTimestamp.isValid() || !endTimestamp.isValid()) {
    return { ok: false, error: "Invalid date or time", field: "date" };
  }
  if (endTimestamp.isBefore(startTimestamp)) {
    // We're assuming this means the event bleeds into the next day, which is historically correct
    endTimestamp.add(1, "day");
  }

  try {
    await prisma.event.create({
      data: {
        name: values.name,
        location: values.location,
        startTimestamp: startTimestamp.toDate(),
        endTimestamp: endTimestamp.toDate(),
        description: values.description,
        image: values.coverImage,
        gallery: values.gallery,
        slug: values.slug,
        eventTags: {
          connectOrCreate: values.tags.map((tag) => ({
            where: { text: tag.text },
            create: tag,
          })),
        },
      } satisfies Prisma.EventCreateInput,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "An event with this slug already exists", field: "slug" };
    }
    console.error("createEvent failed", error);
    return { ok: false, error: "Couldn't create the event. Please try again." };
  }

  revalidatePath("/events");
  revalidatePath("/");
  return { ok: true };
}
