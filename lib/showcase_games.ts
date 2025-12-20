import { GameStatus } from "./generated/prisma/enums"
import { GetStoredImageUrl } from "./images"
import { prisma } from "./prisma"

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
export async function getShowcaseGames() {
  try {
    const gamesList = await prisma.game.findMany({
      include: { gameTags: true }
    });

    const gamesDetailsPromises = gamesList.map(async (game) => {
      const gameThumbnail = game.thumbnail 
        ? await GetStoredImageUrl(game.thumbnail)
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
    return await Promise.all(gamesDetailsPromises);
  } catch (error) {
    console.log(error);
    return []
  }
}
