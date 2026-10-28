import { formatDateOnly, toDateInputValue } from "./dateUtils"
import type { GameStatusType } from "./generated/zod/inputTypeSchemas/GameStatusSchema"
import { getStoredImageUrl } from "./images.server"
import { prisma } from "./prisma"
import { Result } from "./utils"
import type { GameInput } from "./schemas/game"

export type ShowcaseGameTag = {
  text: string
  color: string
}

/** The details of a showcase game. */
export type ShowcaseGamesDetails = {
  id: number
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
  formValues: GameInput
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

    const gamesDetailsPromises = gamesList.map(async (game) => {
      const gameThumbnail = game.thumbnail 
        ? await getStoredImageUrl(game.thumbnail)
        : "";

      return {
        id: game.id,
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
        formValues: {
          title: game.title,
          credits: game.credits,
          description: game.description,
          releaseDate: toDateInputValue(game.releaseDate),
          status: game.status,
          difficulty: game.difficulty,
          isWebPlayable: game.isWebPlayable,
          hasSeal: game.hasSeal,
          link: game.link ?? "",
          thumbnail: game.thumbnail ?? "",
          tags: game.gameTags.map((tag) => ({
            text: tag.text,
            color: tag.color,
          })),
        },
      } satisfies ShowcaseGamesDetails;
    });

    return {
      ok: true,
      data: await Promise.all(gamesDetailsPromises)
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}
