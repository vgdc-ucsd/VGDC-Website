import { GameStatus } from "./generated/prisma/enums"
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
    const gamesDetails: ShowcaseGamesDetails[] = gamesList.map((game) => ({
      title: game.title,
      releaseDate: game.releaseDate.toLocaleDateString(),
      difficulty: game.difficulty,
      description: game.description,
      credits: game.credits.toString(),
      link: game.link ?? "",
      status: game.status,
      image: game.thumbnail ?? "",
      tags: game.gameTags.map((tag) => ({
        text: tag.text,
        color: tag.color,
      })),
      vgdcApproved: game.hasSeal,
      web: game.isWebPlayable,
    }));
    return gamesDetails;
  } catch (error) {
    console.log(error);
    return []
  }
}
