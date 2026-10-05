"use server"

import { auth } from "@/lib/auth";
import { EventFormValues, EventInput, eventInputSchema } from "@/lib/schemas/event";
import moment from "moment-timezone";
import { parseDateOnly, Timezone } from "@/lib/dateUtils";
import { revalidatePath } from "next/cache";
import { ImageFolder } from "@/lib/images.shared";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { GameFormValues, GameInput, gameInputSchema } from "@/lib/schemas/game";
import { BlogPostCreateInput, GameCreateInput } from "@/lib/generated/prisma/models";
import { BlogPostFormValues, BlogPostInput, blogPostInputSchema } from "@/lib/schemas/blog-post";

export type FormActionResult<TValues> = 
  | { ok: true; }
  | { ok: false, error: string; field?: keyof TValues };

const TIME_FORMAT = "YYYY-MM-DD HH:mm";

const validateImagePath = (folder: ImageFolder) =>
  z.string().regex(
    new RegExp(
      `^${folder}/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(png|jpeg|webp|gif|avif)$`,
    ),
    "Invalid image path",
  );

export async function createEvent(input: EventInput): Promise<FormActionResult<EventFormValues>> {
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

export async function createGame(input: GameInput): Promise<FormActionResult<GameFormValues>> {
  const session = await auth();
  if (!session) return { ok: false, error: "You must be signed in as an officer to create a game" };

  const parsed = gameInputSchema.extend({
    thumbnail: validateImagePath("games").optional().or(z.literal(""))
  }).safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: issue.path[0] as keyof GameFormValues };
  }
  const values = parsed.data;

  const releaseDate = parseDateOnly(values.releaseDate);
  if (!releaseDate) {
    return { ok: false, error: "Invalid release date", field: "releaseDate" };
  }

  try {
    await prisma.game.create({
      data: {
        title: values.title,
        credits: values.credits,
        description: values.description,
        releaseDate: releaseDate,
        difficulty: values.difficulty,
        link: values.link || null,
        thumbnail: values.thumbnail,
        isWebPlayable: values.isWebPlayable,
        status: values.status,
        hasSeal: values.hasSeal,
        gameTags: {
          connectOrCreate: values.tags.map((tag) => ({
            where: { text: tag.text },
            create: tag,
          }))
        }
      } satisfies GameCreateInput
    });
  } catch (error) {
    console.error("createGame failed", error);
    return { ok: false, error: "Couldn't create the game. Please try again." };
  }

  revalidatePath("/games");
  return { ok: true };
}

export async function createBlogPost(input: BlogPostInput): Promise<FormActionResult<BlogPostFormValues>> {
  const session = await auth();
  if (!session) return { ok: false, error: "You must be signed in as an officer to create a game" };

  const parsed = blogPostInputSchema.extend({
    coverImage: validateImagePath("blogs").optional().or(z.literal(""))
  }).safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: issue.path[0] as keyof BlogPostFormValues };
  }
  const values = parsed.data;

  const date = parseDateOnly(values.date);
  if (!date) {
    return { ok: false, error: "Invalid date", field: "date" };
  }

  try {
    await prisma.blogPost.create({
      data: {
        title: values.title,
        subtitle: values.subtitle,
        date: date,
        authors: values.authors,
        coverImage: values.coverImage || null,
        coverCaption: values.coverCaption || null,
        postData: values.postData,
        slug: values.slug,
      } satisfies BlogPostCreateInput
    });
  } catch (error) {
    console.error("createBlogPost failed", error);
    return { ok: false, error: "Couldn't create the blog post. Please try again." };
  }

  revalidatePath("/news")
  revalidatePath("/");
  return { ok: true };
}
