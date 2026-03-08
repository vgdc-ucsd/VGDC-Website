import { GameStatus } from "./generated/prisma/enums"
import { getStoredImageUrl } from "./images"
import { prisma } from "./prisma"
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
  status: GameStatus
  image: string
  tags: ShowcaseGameTag[]
  vgdcApproved: boolean
  web: boolean
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
        title: game.title,
        releaseDate: game.releaseDate.toLocaleDateString(),
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
      } satisfies ShowcaseGamesDetails;
    });

    return {
      ok: true,
      data: await Promise.all(gamesDetailsPromises)
    };
  } catch (error) {
    console.log(error);
    return { ok: false, error: "Internal server error" }
  }
}
