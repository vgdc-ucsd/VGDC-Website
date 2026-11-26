"use server"

import { randomInt } from "node:crypto"
import z from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Mascot } from "@/lib/generated/prisma/enums"

// Same order as MASCOT_SRCS in VGDCGame.tsx
const MASCOTS: Mascot[] = [Mascot.VIVI, Mascot.CICI, Mascot.DOUG, Mascot.GIGI]
const LEADERBOARD_SIZE = 10

export type LeaderboardRow = { id: number; displayName: string; score: number }
export type LeaderboardResult = { entries: LeaderboardRow[]; entryId: number | null }

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  return prisma.leaderboardEntry.findMany({
    select: { id: true, displayName: true, score: true },
    orderBy: [{ score: "desc" }, { achievedAt: "asc" }],
    take: LEADERBOARD_SIZE,
  })
}

const submitSchema = z.object({
  score: z.number().int().min(1).max(2_147_483_647), // PostgreSQL Int range
  mascotIndex: z.number().int().min(0).max(MASCOTS.length - 1),
})

export async function submitScore(score: number, mascotIndex: number): Promise<LeaderboardResult> {
  const rejected = async () => ({ entries: await getLeaderboard(), entryId: null })

  const parsed = submitSchema.safeParse({ score, mascotIndex })
  if (!parsed.success) return rejected()

  const session = await auth()
  const discordId = session?.user?.id
  if (!discordId) return rejected()

  const mascot = MASCOTS[parsed.data.mascotIndex]
  const finalScore = parsed.data.score
  const entry = await prisma.leaderboardEntry.upsert({
    where: { discordId },
    create: {
      discordId,
      displayName: `${mascot.toLowerCase()}${randomInt(10000, 100000)}`,
      mascot,
      score: finalScore,
    },
    // Keep the original name; a nonempty update allows a native database upsert.
    update: { discordId },
    select: { id: true },
  })

  // A conditional update keeps concurrent submissions from lowering the best.
  await prisma.leaderboardEntry.updateMany({
    where: { id: entry.id, score: { lt: finalScore } },
    data: { score: finalScore, mascot, achievedAt: new Date() },
  })

  const entries = await getLeaderboard()
  return { entries, entryId: entries.some((e) => e.id === entry.id) ? entry.id : null }
}
