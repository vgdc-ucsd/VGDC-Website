import type { ShowcaseGamesDetails } from "@/lib/showcase_games"

/** A game that can land in a slot (any game with the VGDC seal). */
export type SlotGame = ShowcaseGamesDetails

/** Number of reels in the machine. */
export const REEL_COUNT = 5

/**
 * The slots shown before any spin (also what the server renders).
 * Deterministic on purpose: random values here would differ between
 * the server and client render and cause a hydration mismatch.
 * Cycles through the pool when it has fewer games than reels.
 */
export function initialSlots(pool: SlotGame[]): SlotGame[] {
  return Array.from({ length: REEL_COUNT }, (_, i) => pool[i % pool.length])
}

/** Random integer in [0, max). */
function randomIndex(max: number): number {
  return Math.floor(Math.random() * max)
}

/**
 * Shuffles the pool and returns `count` games for the intro spin.
 * No duplicates when the pool is big enough; otherwise cycles through it.
 */
export function pickRandomSlots(pool: SlotGame[], count: number): SlotGame[] {
  const copy = [...pool]
  // Fisher–Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return Array.from({ length: count }, (_, i) => copy[i % copy.length])
}

/** Picks the lever's winning game, avoiding the previous winner when possible. */
export function pickWinner(pool: SlotGame[], previous: SlotGame | null): SlotGame {
  const candidates = pool.length > 1 ? pool.filter((g) => g !== previous) : pool
  return candidates[randomIndex(candidates.length)]
}

/**
 * Builds the strip of games a reel scrolls through during a spin:
 * starts on `from` (the current face), ends on `target`, with random
 * games in between that never repeat back to back.
 */
export function buildStrip(
  pool: SlotGame[],
  from: SlotGame,
  target: SlotGame,
  length: number
): SlotGame[] {
  const strip = [from]
  for (let i = 0; i < length; i++) {
    const prev = strip[strip.length - 1]
    const options = pool.length > 1 ? pool.filter((g) => g !== prev) : pool
    strip.push(options[randomIndex(options.length)])
  }
  // Avoid a back-to-back repeat right before the target, too
  if (pool.length > 1 && strip[strip.length - 1] === target) {
    strip[strip.length - 1] = pool.find((g) => g !== target && g !== strip[strip.length - 2]) ?? strip[strip.length - 1]
  }
  strip.push(target)
  return strip
}

/**
 * How far the strip moves up so its last item fills the reel window.
 * A percentage `y` is relative to the strip's own height (n items tall),
 * so moving up n - 1 items is -(n - 1) / n of it.
 */
export function stripEndY(n: number): string {
  return `${(-(n - 1) / n) * 100}%`
}
