"use server"

import { randomInt } from "node:crypto"
import z from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Mascot } from "@/lib/generated/prisma/enums"

// Same order as MASCOT_SRCS in VGDCGame.tsx
const MASCOTS: Mascot[] = [Mascot.VIVI, Mascot.CICI, Mascot.DOUG, Mascot.GIGI]
const LEADERBOARD_SIZE = 10

// The game awards at most 1 point per 100 ms, so a score can't exceed elapsed time / 100
const MS_PER_POINT = 100
const SCORE_SLACK = 20 // covers network delay before the server records the start
const RUN_TTL_MS = 60 * 60 * 1000
const STALE_RUN_MS = 24 * 60 * 60 * 1000

export type LeaderboardRow = { id: number; displayName: string; score: number }
export type LeaderboardResult = { entries: LeaderboardRow[]; entryId: number | null }

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  return prisma.leaderboardEntry.findMany({
    select: { id: true, displayName: true, score: true },
    orderBy: [{ score: "desc" }, { achievedAt: "asc" }],
    take: LEADERBOARD_SIZE,
  })
}

// Returns a run id. The mascot, player and start time are fixed here, not at submit.
export async function startRun(mascotIndex: number): Promise<string | null> {
  const mascot = MASCOTS[mascotIndex]
  if (!mascot) return null

  const session = await auth()
  const run = await prisma.gameRun.create({
    data: { mascot, discordId: session?.user?.id ?? null },
    select: { id: true },
  })

  await prisma.gameRun
    .deleteMany({ where: { startedAt: { lt: new Date(Date.now() - STALE_RUN_MS) } } })
    .catch(() => {})

  return run.id
}

const submitSchema = z.object({
  runId: z.string().uuid(),
  score: z.number().int().min(0),
})

export async function submitRun(runId: string, score: number): Promise<LeaderboardResult> {
  const rejected = async () => ({ entries: await getLeaderboard(), entryId: null })

  const parsed = submitSchema.safeParse({ runId, score })
  if (!parsed.success) return rejected()

  const session = await auth()
  const discordId = session?.user?.id ?? null

  const run = await prisma.gameRun.findUnique({ where: { id: parsed.data.runId } })
  if (!run || run.discordId !== discordId) return rejected()

  const now = Date.now()
  const elapsed = now - run.startedAt.getTime()
  if (elapsed > RUN_TTL_MS || parsed.data.score > elapsed / MS_PER_POINT + SCORE_SLACK) return rejected()

  // Claim the run atomically so it can only be submitted once
  const claimed = await prisma.gameRun.updateMany({
    where: { id: run.id, submittedAt: null },
    data: { submittedAt: new Date(now) },
  })
  if (claimed.count !== 1 || parsed.data.score === 0) return rejected()

  const finalScore = parsed.data.score
  let entryId: number | null = null

  if (discordId) {
    const displayName = session?.user?.username || session?.user?.name || "player"
    const entry = await prisma.leaderboardEntry.upsert({
      where: { discordId },
      create: { discordId, displayName, mascot: run.mascot, score: finalScore },
      update: { displayName },
      select: { id: true },
    })
    // Only raise a player's best
    await prisma.leaderboardEntry.updateMany({
      where: { id: entry.id, score: { lt: finalScore } },
      data: { score: finalScore, mascot: run.mascot, achievedAt: new Date(now) },
    })
    entryId = entry.id
  } else {
    const board = await getLeaderboard()
    const cutoff = board.length < LEADERBOARD_SIZE ? 0 : board[board.length - 1].score
    if (finalScore > cutoff) {
      const entry = await prisma.leaderboardEntry.create({
        data: {
          displayName: `${run.mascot.toLowerCase()}${randomInt(10000, 100000)}`,
          mascot: run.mascot,
          score: finalScore,
        },
        select: { id: true },
      })
      entryId = entry.id
    }
  }

  const entries = await getLeaderboard()

  // Guest rows that fell off the board are never shown again
  await prisma.leaderboardEntry
    .deleteMany({ where: { discordId: null, id: { notIn: entries.map((e) => e.id) } } })
    .catch(() => {})

  return { entries, entryId: entries.some((e) => e.id === entryId) ? entryId : null }
}
