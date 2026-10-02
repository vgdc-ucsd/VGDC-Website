"use client"

import { useEffect, useRef } from "react"
import type { AABB, GameState, VGDCGameProps, Obstacle } from "./gameTypes"
import {
  MAX_GAME_SPEED,
  MIN_OBSTACLE_GAP,
  MAX_OBSTACLE_GAP,
  OBSTACLE_SIZE,
  PLAYER_HEIGHT,
  PLAYER_X_RATIO,
  GROUND_Y,
  JUMP_VELOCITY,
  GRAVITY,
  MAX_FRAME_DELTA,
  HIGH_SCORE_KEY,
  createDefaultGameState,
  getNextSpawnTime,
  checkAABB,
  VIRTUAL_HEIGHT,
} from "./gameTypes"

const SPRITE_FRAMES = 4
const SPRITE_FRAME_DURATION = 120 // ms per frame — adjust animation speed here
const HUD_FONT = "Mojangles, monospace"
const BG_TINT = "rgba(20, 110, 120, 0.28)"
const OUTLINE_COLOR = "#ffffff"
const OUTLINE_WIDTH = 2 // virtual px
const JUMP_KEYS = new Set(["Space", "ArrowUp", "KeyW"])

// Back to front. speed = fraction of ground speed; Layer 1 (front) moves with the ground
const PARALLAX_LAYERS = [
  { src: "/logos/background/Layer%205.png", speed: 0.1 },
  { src: "/logos/background/Layer%204.png", speed: 0.25 },
  { src: "/logos/background/Layer%203.png", speed: 0.45 },
  { src: "/logos/background/Layer%202.png", speed: 0.7 },
  { src: "/logos/background/Layer%201.png", speed: 1 },
] as const
const PLATFORM_SRC = "/logos/background/Platform.png"

// One is picked at random each run
const MASCOT_SRCS = ["/logos/Vivi.png", "/logos/Cici.png", "/logos/Doug.png", "/logos/Gigi.png"]

//hard coded trees lol
// allocatedartist: XD
const TREE_NATURAL_DIMS = [
  { w: 40, h: 130 }, // Tree1.png
  { w: 30, h: 90 }, // Tree2.png
  { w: 95, h: 100 }, // Tree3.png
] as const

function getSprite(gameState: GameState) {
  return gameState.mascotImgs[gameState.mascotIndex] ?? null
}

// Different mascot from the previous run, when more than one is available
function pickMascot(gameState: GameState) {
  const n = MASCOT_SRCS.length
  if (n < 2) return
  gameState.mascotIndex = (gameState.mascotIndex + 1 + Math.floor(Math.random() * (n - 1))) % n
}

function getPlayerX(gameState: GameState) {
  return Math.round(gameState.viewW * PLAYER_X_RATIO)
}

// Drawn size of the player in virtual px, derived from one sprite frame
function getPlayerSize(gameState: GameState) {
  const img = getSprite(gameState)
  if (!img) return { w: OBSTACLE_SIZE, h: OBSTACLE_SIZE }
  const frameW = img.naturalWidth / SPRITE_FRAMES
  return { w: Math.round((frameW * PLAYER_HEIGHT) / img.naturalHeight), h: PLAYER_HEIGHT }
}

// Collision box, inset from the drawn sprite so near-misses feel fair
function getPlayerAABB(gameState: GameState): AABB {
  const { w, h } = getPlayerSize(gameState)
  const x = getPlayerX(gameState)
  const bottom = GROUND_Y - gameState.playerY
  return {
    minX: x + w * 0.25,
    maxX: x + w * 0.75,
    minY: bottom - h * 0.85,
    maxY: bottom - 2,
  }
}

function formatScore(n: number) {
  return Math.floor(n).toString().padStart(5, "0")
}

function drawShadowText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.75)"
  ctx.fillText(text, x + 2, y + 2)
  ctx.fillStyle = "#ffffff"
  ctx.fillText(text, x, y)
}

// White silhouette of each image, built once and reused for outlines
const silhouetteCache = new WeakMap<HTMLImageElement, HTMLCanvasElement>()

function getSilhouette(img: HTMLImageElement) {
  let sil = silhouetteCache.get(img)
  if (!sil) {
    sil = document.createElement("canvas")
    sil.width = img.naturalWidth
    sil.height = img.naturalHeight
    const sctx = sil.getContext("2d")!
    sctx.drawImage(img, 0, 0)
    sctx.globalCompositeOperation = "source-in"
    sctx.fillStyle = OUTLINE_COLOR
    sctx.fillRect(0, 0, sil.width, sil.height)
    silhouetteCache.set(img, sil)
  }
  return sil
}

const OUTLINE_OFFSETS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
]

// Draws (a region of) an image with a pixel outline hugging its shape
function drawOutlined(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  sx: number, sy: number, sw: number, sh: number,
  dx: number, dy: number, dw: number, dh: number
) {
  const sil = getSilhouette(img)
  for (const [ox, oy] of OUTLINE_OFFSETS) {
    ctx.drawImage(sil, sx, sy, sw, sh, dx + ox * OUTLINE_WIDTH, dy + oy * OUTLINE_WIDTH, dw, dh)
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

// Pure draw of the current state; never schedules frames itself.
function render(canvas: HTMLCanvasElement, gameState: GameState) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const scale = canvas.height / VIRTUAL_HEIGHT
  const viewW = gameState.viewW
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.imageSmoothingEnabled = false

  // Parallax background: each layer tiles horizontally and scrolls at its own
  // fraction of ground speed, back to front
  const anyLayer = gameState.bgLayers.some(Boolean)
  if (!anyLayer) {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, viewW, VIRTUAL_HEIGHT)
  }
  const tileLayer = (layer: HTMLImageElement, speed: number) => {
    const bgW = Math.round((layer.naturalWidth * VIRTUAL_HEIGHT) / layer.naturalHeight)
    const scroll = gameState.bgX * speed
    const offset = Math.round(((scroll % bgW) + bgW) % bgW)
    for (let x = offset - bgW; x < viewW; x += bgW) {
      ctx.drawImage(layer, x, 0, bgW, VIRTUAL_HEIGHT)
    }
  }

  gameState.bgLayers.forEach((layer, i) => {
    if (layer) tileLayer(layer, PARALLAX_LAYERS[i].speed)
  })

  // Teal wash over the background so the trees and player pop against it
  ctx.fillStyle = BG_TINT
  ctx.fillRect(0, 0, viewW, VIRTUAL_HEIGHT)

  // Ground platform covers every layer and keeps its true colour
  if (gameState.platformImg) tileLayer(gameState.platformImg, 1)

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, GROUND_Y, viewW, 2)

  for (const obstacle of gameState.obstacles) {
    const treeImg = gameState.treeImgs[obstacle.imgIndex]
    const y = GROUND_Y - obstacle.scaleY
    if (treeImg && treeImg.naturalWidth > 0) {
      drawOutlined(
        ctx, treeImg,
        0, 0, treeImg.naturalWidth, treeImg.naturalHeight,
        obstacle.posX, y, obstacle.scaleX, obstacle.scaleY
      )
    } else {
      ctx.fillStyle = "#aa0000"
      ctx.fillRect(obstacle.posX, y, obstacle.scaleX, obstacle.scaleY)
    }
  }

  const px = getPlayerX(gameState)
  const { w: pw, h: ph } = getPlayerSize(gameState)
  const py = GROUND_Y - ph - gameState.playerY
  const sprite = getSprite(gameState)
  if (sprite) {
    const frameW = sprite.naturalWidth / SPRITE_FRAMES
    drawOutlined(
      ctx, sprite,
      gameState.spriteFrame * frameW, 0, frameW, sprite.naturalHeight,
      px, py, pw, ph
    )
  } else {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(px, py, pw, ph)
  }

  if (gameState.phase === "idle") return

  // HUD — pixel font, Chrome-dino style "HI 00420  00137"
  ctx.font = `20px ${HUD_FONT}`
  ctx.textBaseline = "top"
  ctx.textAlign = "right"
  const hudY = 18
  const right = viewW - 20
  if (gameState.scoreVisible || gameState.phase === "dead") {
    // While flashing for a milestone, hold the milestone value
    const shown = gameState.phase !== "dead" && gameState.score >= gameState.nextFlashTime
      ? gameState.nextFlashTime
      : gameState.score
    drawShadowText(ctx, formatScore(shown), right, hudY)
  }
  if (gameState.highScore > 0) {
    const scoreW = ctx.measureText("00000").width
    ctx.globalAlpha = 0.7
    drawShadowText(ctx, `HI ${formatScore(gameState.highScore)}`, right - scoreW - 24, hudY)
    ctx.globalAlpha = 1
  }

  // Controls hint for the first couple of seconds
  if (gameState.phase === "running" && gameState.score < 25) {
    ctx.globalAlpha = Math.min(1, (25 - gameState.score) / 8)
    ctx.textAlign = "center"
    ctx.font = `18px ${HUD_FONT}`
    drawShadowText(ctx, "SPACE / TAP TO JUMP", viewW / 2, VIRTUAL_HEIGHT * 0.3)
    ctx.globalAlpha = 1
  }
}

function spawnObstacle(gameState: GameState) {
  const lastObstacle = gameState.obstacles[gameState.obstacles.length - 1]
  const gap = Math.random() * (MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP) + MIN_OBSTACLE_GAP

  const imgIndex = Math.floor(Math.random() * TREE_NATURAL_DIMS.length)
  const nat = TREE_NATURAL_DIMS[imgIndex]
  const scaleY = Math.min(Math.round(VIRTUAL_HEIGHT * 0.2), 80)
  const scaleX = Math.round((nat.w * scaleY) / nat.h)

  const posX = lastObstacle
    ? Math.max(lastObstacle.posX, gameState.viewW) + gap
    : gameState.viewW + MIN_OBSTACLE_GAP
  const obstacle: Obstacle = { posX, scaleX, scaleY, imgIndex }
  gameState.obstacles.push(obstacle)
}

function updateObstacles(gameState: GameState, delta: number) {
  const playerAABB = getPlayerAABB(gameState)

  for (const obstacle of gameState.obstacles) {
    obstacle.posX -= gameState.gameSpeed * delta

    const obstacleAABB: AABB = {
      minX: obstacle.posX,
      maxX: obstacle.posX + obstacle.scaleX,
      minY: GROUND_Y - obstacle.scaleY,
      maxY: GROUND_Y,
    }

    if (checkAABB(playerAABB, obstacleAABB)) {
      gameState.phase = "dead"
      return
    }
  }

  const CLIP_DISTANCE = -100
  while (gameState.obstacles.length > 0 && gameState.obstacles[0].posX <= CLIP_DISTANCE) {
    gameState.obstacles.shift()
  }
}

function updateGame(gameState: GameState, now: number) {
  if (gameState.phase !== "running") return

  const delta = Math.min(now - gameState.lastTime, MAX_FRAME_DELTA)
  gameState.lastTime = now
  if (delta <= 0) return

  gameState.score += delta * 0.01

  // Every 100 points: flash the score and speed up a little
  if (gameState.score >= gameState.nextFlashTime) {
    gameState.flashTimer += delta * 0.01
  }
  if (gameState.score > gameState.nextFlashTime + 10) {
    gameState.gameSpeed = Math.min(gameState.gameSpeed + 0.05, MAX_GAME_SPEED)
    gameState.nextFlashTime += 100
    gameState.flashTimer = 0
    gameState.scoreVisible = true
  }
  if (gameState.flashTimer >= 1) {
    gameState.scoreVisible = !gameState.scoreVisible
    gameState.flashTimer = 0
  }

  gameState.bgX -= gameState.gameSpeed * delta

  // Player physics (semi-implicit Euler, frame-rate independent)
  if (gameState.jump && gameState.onGround) {
    gameState.playerVY = JUMP_VELOCITY
    gameState.onGround = false
  }
  gameState.playerVY -= GRAVITY * delta
  gameState.playerY += gameState.playerVY * delta
  if (gameState.playerY <= 0) {
    gameState.playerY = 0
    gameState.playerVY = 0
    gameState.onGround = true
  }

  if (now - gameState.spriteLastFrameTime > SPRITE_FRAME_DURATION) {
    gameState.spriteFrame = (gameState.spriteFrame + 1) % SPRITE_FRAMES
    gameState.spriteLastFrameTime = now
  }

  updateObstacles(gameState, delta)

  gameState.spawnTimer += delta
  if (gameState.spawnTimer >= gameState.nextSpawnTime) {
    spawnObstacle(gameState)
    getNextSpawnTime(gameState)
  }
}

// Reset to a fresh run, keeping loaded assets, high score and view size
function resetGame(gameState: GameState) {
  const { mascotImgs, mascotIndex, bgLayers, platformImg, treeImgs, highScore, viewW } = gameState
  Object.assign(gameState, createDefaultGameState(), {
    mascotImgs, mascotIndex, bgLayers, platformImg, treeImgs, highScore, viewW,
  })
}

function readHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0
  } catch {
    return 0
  }
}

function writeHighScore(score: number) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    // storage unavailable (private mode etc.) — high score just won't persist
  }
}

export default function VGDCGame({ isActive, runId = 0, onGameOver }: VGDCGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<GameState>(createDefaultGameState())
  const rafRef = useRef<number | null>(null)
  const onGameOverRef = useRef(onGameOver)
  useEffect(() => {
    onGameOverRef.current = onGameOver
  }, [onGameOver])

  const redraw = () => {
    if (canvasRef.current) render(canvasRef.current, gameRef.current)
  }

  // Asset + font loading; redraw as each arrives so the idle scene fills in
  useEffect(() => {
    const gs = gameRef.current
    gs.highScore = readHighScore()
    // Random starting mascot, so pickMascot's "different from last run" rule
    // doesn't keep the first run from ever getting index 0
    gs.mascotIndex = Math.floor(Math.random() * MASCOT_SRCS.length)

    const load = (src: string, onLoad: (img: HTMLImageElement) => void) => {
      const img = new Image()
      img.onload = () => {
        onLoad(img)
        redraw()
      }
      img.src = src
    }
    MASCOT_SRCS.forEach((src, i) => load(src, (img) => { gs.mascotImgs[i] = img }))
    load(PLATFORM_SRC, (img) => { gs.platformImg = img })
    PARALLAX_LAYERS.forEach(({ src }, i) => load(src, (img) => { gs.bgLayers[i] = img }))
    ;["/logos/Tree1.png", "/logos/Tree2.png", "/logos/Tree3.png"].forEach((src, i) =>
      load(src, (img) => { gs.treeImgs[i] = img })
    )
    document.fonts?.load(`20px ${HUD_FONT}`).then(redraw, () => {})
  }, [])

  // Keep the canvas backing store matched to its on-screen size (× DPR) and
  // widen the virtual view to the container's aspect ratio — no letterboxing.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width === 0 || height === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      gameRef.current.viewW = (VIRTUAL_HEIGHT * canvas.width) / canvas.height
      render(canvas, gameRef.current)
    })

    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // Keyboard: only while a run is in progress, and only for jump keys, so the
  // rest of the page keeps normal keyboard behaviour.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const phase = gameRef.current.phase
      if (phase === "idle" || !JUMP_KEYS.has(e.code)) return
      const target = e.target as HTMLElement | null
      // Leave focused controls alone so Space/Enter still activate them
      if (target?.closest("button, a, input, textarea, select, [contenteditable]")) return
      // Also swallow jump keys after death so a mashed Space doesn't scroll the page
      e.preventDefault()
      if (phase === "running") gameRef.current.jump = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (JUMP_KEYS.has(e.code)) gameRef.current.jump = false
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  // Start / restart / stop the single game loop
  useEffect(() => {
    const canvas = canvasRef.current
    const gs = gameRef.current
    if (!canvas) return

    resetGame(gs)

    if (isActive) {
      pickMascot(gs)
      gs.phase = "running"
      gs.lastTime = performance.now()
      getNextSpawnTime(gs)

      const tick = (now: number) => {
        updateGame(gs, now)
        render(canvas, gs)
        if (gs.phase === "running") {
          rafRef.current = requestAnimationFrame(tick)
          return
        }
        rafRef.current = null
        const score = Math.floor(gs.score)
        const isNewBest = score > gs.highScore
        if (isNewBest) {
          gs.highScore = score
          writeHighScore(score)
        }
        render(canvas, gs)
        onGameOverRef.current?.({ score, best: gs.highScore, isNewBest })
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      render(canvas, gs)
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      gs.jump = false
    }
  }, [isActive, runId])

  const setJump = (value: boolean) => {
    if (gameRef.current.phase === "running") gameRef.current.jump = value
  }

  return (
    <div
      className="h-full w-full touch-none select-none"
      onPointerDown={() => setJump(true)}
      onPointerUp={() => setJump(false)}
      onPointerCancel={() => setJump(false)}
      onPointerLeave={() => setJump(false)}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-label="VGDC mini game — press space or tap to jump"
      />
    </div>
  )
}
