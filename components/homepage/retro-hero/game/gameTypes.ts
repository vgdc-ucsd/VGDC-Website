// Props for the VGDCGame canvas component
export interface VGDCGameProps {
  isActive: boolean
}

// Game phases — expanded when the game loop is added
export type GamePhase = "idle" | "running" | "dead"

// Full game state lives in a useRef so it never triggers re-renders during the loop.
// Fields are added here incrementally as features are built.
export interface GameState {
  phase: GamePhase
  // score: number
  // playerY: number
  // playerVY: number
  // isOnGround: boolean
  // obstacles: Obstacle[]
  // bgX: number
  // frameId: number
  // lastTime: number
  // obstacleTimer: number
  // canvasW: number
  // canvasH: number
  // assets: GameAssets | null
}

// Asset handles loaded via new Image() inside the canvas component
export interface GameAssets {
  // player: HTMLImageElement
  // obstacle: HTMLImageElement
  // background: HTMLImageElement
}
