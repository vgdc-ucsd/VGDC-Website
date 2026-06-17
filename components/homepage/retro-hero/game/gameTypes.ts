// Props for the VGDCGame canvas component
export interface VGDCGameProps {
  isActive: boolean
}


// Game phases — expanded when the game loop is added
export type GamePhase = "idle" | "running" | "dead"

// In px
export const MIN_OBSTACLE_GAP = 300;
export const MAX_OBSTACLE_GAP = 800;

export const OBSTACLE_SIZE = 32;

export const MAX_GAME_SPEED = 1.5;
export const MIN_GAME_SPEED = 0.35;

export const VIRTUAL_WIDTH = 640;
export const VIRTUAL_HEIGHT = 480;

const JUMP_VELOCITY = 16;

export interface Obstacle {
  posX: number
  scaleX: number,
  scaleY: number,
  imgIndex: number  // 0=Tree1, 1=Tree2, 2=Tree3
}

// Full game state lives in a useRef so it never triggers re-renders during the loop.
// Fields are added here incrementally as features are built.
export interface GameState {
  phase: GamePhase
  score: number
  playerX: number
  playerY: number
  playerVY: number
  groundY: number
  obstacles: Obstacle[]
  lastTime: number
  gravity: number
  onGround: boolean
  jump: boolean
  jumpVelocity: number
  spawnTimer: number
  nextSpawnTime: number
  gameSpeed: number
  nextFlashTime: number,
  flashTimer: number,
  scoreVisible: boolean
  spriteImg: HTMLImageElement | null  // loaded sprite sheet (4 frames, horizontal)
  spriteFrame: number                 // current frame index 0–3
  spriteLastFrameTime: number         // timestamp of last frame advance
  bgImg: HTMLImageElement | null      // parallax background image
  bgX: number                         // current scroll offset in pixels
  treeImgs: (HTMLImageElement | null)[]  // [Tree1, Tree2, Tree3]
  // bgX: number
  // frameId: number
  // obstacleTimer: number
  // assets: GameAssets | null
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
    playerX: 0,
    playerY: 0,
    playerVY: 0,
    groundY: 0,
    obstacles: [],
    lastTime: 0,
    gravity: 0.048,
    onGround: true,
    jump: false,
    jumpVelocity: JUMP_VELOCITY,
    spawnTimer: 0,
    nextSpawnTime: 0,
    gameSpeed: MIN_GAME_SPEED,
    nextFlashTime: 100,
    flashTimer: 0,
    scoreVisible: true,
    spriteImg: null,
    spriteFrame: 0,
    spriteLastFrameTime: 0,
    bgImg: null,
    bgX: 0,
    treeImgs: [null, null, null],
  };
}

export function getNextSpawnTime(gameState: GameState) {
  const MIN_TIME = MIN_OBSTACLE_GAP / gameState.gameSpeed;
  const MAX_TIME = MAX_OBSTACLE_GAP / gameState.gameSpeed;
  const timeDiff = MAX_TIME - MIN_TIME;

  gameState.spawnTimer = 0;
  gameState.nextSpawnTime = Math.random() * timeDiff + MIN_TIME;
}

// true if colliding, false if not
export function checkAABB(a: AABB, b: AABB): boolean {
  return a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY;
}

// Asset handles loaded via new Image() inside the canvas component
export interface GameAssets {
  // player: HTMLImageElement
  // obstacle: HTMLImageElement
  // background: HTMLImageElement
}

