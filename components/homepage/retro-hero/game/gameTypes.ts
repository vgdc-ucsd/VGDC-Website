export interface GameOverInfo {
  score: number
  best: number
  isNewBest: boolean
}

// Props for the VGDCGame canvas component
export interface VGDCGameProps {
  isActive: boolean
  // Bump to start a fresh run while already active (restart after game over)
  runId?: number
  onGameOver?: (info: GameOverInfo) => void
}

export type GamePhase = "idle" | "running" | "dead"

// All gameplay happens in virtual pixels. The virtual height is fixed; the
// virtual width follows the canvas aspect ratio so the scene always fills
// the window (wider screens simply see further ahead).
export const VIRTUAL_HEIGHT = 480
export const DEFAULT_VIEW_WIDTH = Math.round((VIRTUAL_HEIGHT * 16) / 9)

// Platform.png is 1080px tall with its top edge at row 870; the ground sits there
export const PLATFORM_TOP_ROW = 870
export const GROUND_Y = Math.round((VIRTUAL_HEIGHT * PLATFORM_TOP_ROW) / 1080)
export const PLAYER_X_RATIO = 0.12

// In virtual px
export const MIN_OBSTACLE_GAP = 300
export const MAX_OBSTACLE_GAP = 800
export const OBSTACLE_SIZE = 32
export const PLAYER_HEIGHT = 120

// px per ms
export const MAX_GAME_SPEED = 1.5
export const MIN_GAME_SPEED = 0.35

// px/ms and px/ms² — ~160px jump apex, ~0.67s airtime
export const JUMP_VELOCITY = 0.96
export const GRAVITY = 0.00288

// Longest simulated step; avoids teleporting after a tab switch or hitch
export const MAX_FRAME_DELTA = 50

export const HIGH_SCORE_KEY = "vgdc-hiscore"

export interface Obstacle {
  posX: number
  scaleX: number
  scaleY: number
  imgIndex: number // 0=Tree1, 1=Tree2, 2=Tree3
}

// Full game state lives in a useRef so it never triggers re-renders during the loop.
export interface GameState {
  phase: GamePhase
  score: number
  highScore: number
  viewW: number
  playerY: number
  playerVY: number
  obstacles: Obstacle[]
  lastTime: number
  onGround: boolean
  jump: boolean
  spawnTimer: number
  nextSpawnTime: number
  gameSpeed: number
  nextFlashTime: number
  flashTimer: number
  scoreVisible: boolean
  mascotImgs: (HTMLImageElement | null)[] // mascot sprite sheets (4 frames, horizontal)
  mascotIndex: number // mascot used for the current run
  spriteFrame: number // current frame index 0–3
  spriteLastFrameTime: number // timestamp of last frame advance
  bgLayers: (HTMLImageElement | null)[] // parallax layers, back (Layer 5) to front (Layer 1)
  platformImg: HTMLImageElement | null // ground platform, drawn over all layers
  bgX: number // distance scrolled at ground speed; layers scale it by their parallax factor
  treeImgs: (HTMLImageElement | null)[] // [Tree1, Tree2, Tree3]
}

export interface AABB {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export function createDefaultGameState(): GameState {
  return {
    phase: "idle",
    score: 0,
    highScore: 0,
    viewW: DEFAULT_VIEW_WIDTH,
    playerY: 0,
    playerVY: 0,
    obstacles: [],
    lastTime: 0,
    onGround: true,
    jump: false,
    spawnTimer: 0,
    nextSpawnTime: 0,
    gameSpeed: MIN_GAME_SPEED,
    nextFlashTime: 100,
    flashTimer: 0,
    scoreVisible: true,
    mascotImgs: [],
    mascotIndex: 0,
    spriteFrame: 0,
    spriteLastFrameTime: 0,
    bgLayers: [null, null, null, null, null],
    platformImg: null,
    bgX: 0,
    treeImgs: [null, null, null],
  }
}

export function getNextSpawnTime(gameState: GameState) {
  const MIN_TIME = MIN_OBSTACLE_GAP / gameState.gameSpeed
  const MAX_TIME = MAX_OBSTACLE_GAP / gameState.gameSpeed
  const timeDiff = MAX_TIME - MIN_TIME

  gameState.spawnTimer = 0
  gameState.nextSpawnTime = Math.random() * timeDiff + MIN_TIME
}

// true if colliding, false if not
export function checkAABB(a: AABB, b: AABB): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY
}
