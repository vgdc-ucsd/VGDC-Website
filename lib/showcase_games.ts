import { formatDateOnly } from "./dateUtils"
import type { GameStatusType } from "./generated/zod/inputTypeSchemas/GameStatusSchema"
import { getStoredImageUrl } from "./images.server"
import { prisma } from "./prisma"
import type { Prisma } from "./generated/prisma/client"
import { Result } from "./utils"

export type ShowcaseGameTag = {
  text: string
  color: string
}

/** The details of a showcase game. */
export type ShowcaseGamesDetails = {
  title: string
  releaseDate: string
  difficulty: number
  description: string
  credits: string
  link: string
  status: GameStatusType
  image: string
  tags: ShowcaseGameTag[]
  vgdcApproved: boolean
  web: boolean
}

type GameWithTags = Prisma.GameGetPayload<{ include: { gameTags: true } }>

/** Converts a database game row into the shape the frontend uses. */
async function toShowcaseDetails(game: GameWithTags): Promise<ShowcaseGamesDetails> {
  const gameThumbnail = game.thumbnail
    ? await getStoredImageUrl(game.thumbnail)
    : "";

  return {
    title: game.title,
    releaseDate: formatDateOnly(game.releaseDate),
    difficulty: game.difficulty,
    description: game.description,
    credits: game.credits.toString(),
    link: game.link ?? "",
    status: game.status,
    image: gameThumbnail,
    tags: game.gameTags.map((tag) => ({
      text: tag.text,
      color: tag.color,
    })),
    vgdcApproved: game.hasSeal,
    web: game.isWebPlayable,
  };
}

/**
 * Gets the showcase game details
 * @returns List of showcase games details.
 */
export async function getShowcaseGames(): Promise<Result<ShowcaseGamesDetails[]>> {
  try {
    const gamesList = await prisma.game.findMany({
      include: { gameTags: true }
    });

    if (!gamesList) return { ok: false, error: "Failed to get showcase games" }

    return {
      ok: true,
      data: await Promise.all(gamesList.map(toShowcaseDetails))
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}

/**
 * Gets the games that have the VGDC Seal of Approval (featured on the homepage).
 * @returns List of sealed games details.
 */
export async function getSealedGames(): Promise<Result<ShowcaseGamesDetails[]>> {
  try {
    const gamesList = await prisma.game.findMany({
      where: { hasSeal: true },
      include: { gameTags: true }
    });

    return {
      ok: true,
      data: await Promise.all(gamesList.map(toShowcaseDetails))
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}
