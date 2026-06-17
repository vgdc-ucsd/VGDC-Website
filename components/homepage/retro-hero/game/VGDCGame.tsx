"use client"

import { useEffect, useRef } from "react"
import type { AABB, GameState, VGDCGameProps, Obstacle } from "./gameTypes"
import {
  MAX_GAME_SPEED,
  MIN_OBSTACLE_GAP,
  MAX_OBSTACLE_GAP,
  OBSTACLE_SIZE,
  createDefaultGameState,
  getNextSpawnTime,
  checkAABB,
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT
} from "./gameTypes"

// Draws the static game scene onto the canvas.
// This function becomes the RAF loop's render() call in the full implementation.
function drawScene(canvas: HTMLCanvasElement, gameState: GameState) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.imageSmoothingEnabled = false

  ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)

  if (gameState.bgImg) {
    const img = gameState.bgImg;
    const scale = VIRTUAL_HEIGHT / img.naturalHeight;
    const bgW = Math.round(img.naturalWidth * scale);
    const offset = Math.round(((gameState.bgX % bgW) + bgW) % bgW);
    ctx.drawImage(img, offset - bgW, 0, bgW, VIRTUAL_HEIGHT);
    ctx.drawImage(img, offset, 0, bgW, VIRTUAL_HEIGHT);
  } else {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
  }

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, gameState.groundY, VIRTUAL_WIDTH, 2.0)

  for (let obstacle of gameState.obstacles) {
    const treeImg = gameState.treeImgs[obstacle.imgIndex]
    if (treeImg && treeImg.naturalWidth > 0) {
      ctx.drawImage(treeImg, obstacle.posX, gameState.groundY - obstacle.scaleY, obstacle.scaleX, obstacle.scaleY)
    } else {
      ctx.fillStyle = "#aa0000"
      ctx.fillRect(obstacle.posX, gameState.groundY - obstacle.scaleY, obstacle.scaleX, obstacle.scaleY)
    }
  }

  const px = Math.round(VIRTUAL_WIDTH * 0.12);

  if (gameState.spriteImg) {
    const TOTAL_FRAMES = 4
    const FRAME_DURATION = 120 // ms per frame — adjust animation speed here
    const scale = gameState.spriteImg.naturalHeight / VIRTUAL_HEIGHT;
    const frameW = gameState.spriteImg.naturalWidth / TOTAL_FRAMES
    const frameH = gameState.spriteImg.naturalHeight
    const py = gameState.groundY - (frameH * scale) - gameState.playerY
    const now = performance.now()
    if (gameState.phase !== "dead" && now - gameState.spriteLastFrameTime > FRAME_DURATION) {
      gameState.spriteFrame = (gameState.spriteFrame + 1) % TOTAL_FRAMES
      gameState.spriteLastFrameTime = now
    }
    ctx.drawImage(
      gameState.spriteImg,
      gameState.spriteFrame * frameW, 0, frameW, frameH,
      px, py, frameW * scale, frameH * scale
    )
  } else {
    const py = gameState.groundY - OBSTACLE_SIZE - gameState.playerY
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px, py, OBSTACLE_SIZE, OBSTACLE_SIZE);
  }

  if (gameState.phase != "idle") {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "16px monospace";
    if (gameState.scoreVisible || gameState.phase == "dead") {
      let score = gameState.score >=
        gameState.nextFlashTime ?
        gameState.nextFlashTime : gameState.score;

      ctx.strokeText(`Score: ${Math.round(score)}`,
        Math.round(VIRTUAL_WIDTH * 0.8), Math.round(VIRTUAL_HEIGHT * 0.1));
    }

    updateGame(gameState, canvas);
    requestAnimationFrame(() => drawScene(canvas, gameState));
  }
}

//hard coded trees lol
// allocatedartist: XD
const TREE_NATURAL_DIMS = [
  { w: 40, h: 130 },  // Tree1.png
  { w: 30, h: 90 },   // Tree2.png
  { w: 95, h: 100 },  // Tree3.png
] as const

function spawnObstacle(gameState: GameState) {
  const obstaclesCount = gameState.obstacles.length;
  const lastObstacle = gameState.obstacles[obstaclesCount - 1];

  let obstacleDiff = MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP;
  let gap = Math.random() * obstacleDiff + MIN_OBSTACLE_GAP;

  const imgIndex = Math.floor(Math.random() * 3)
  const nat = TREE_NATURAL_DIMS[imgIndex]
  const scaleY = Math.min(Math.round(VIRTUAL_HEIGHT * 0.20), 80)
  const scaleX = Math.round(nat.w * scaleY / nat.h)

  let obstacle: Obstacle = { posX: 0, scaleX, scaleY, imgIndex };
  obstacle.posX = lastObstacle ?
    Math.max(lastObstacle.posX, VIRTUAL_WIDTH) + gap :
    VIRTUAL_WIDTH + MIN_OBSTACLE_GAP;

  gameState.obstacles.push(obstacle);
}

function playerLose(gameState: GameState) {
  gameState.phase = "dead";
  gameState.nextFlashTime += 100;
}

function updateObstacles(gameState: GameState, delta: number) {
  for (let obstacle of gameState.obstacles) {
    obstacle.posX -= gameState.gameSpeed * delta;

    const scale = (gameState.spriteImg?.naturalHeight ?? OBSTACLE_SIZE) / VIRTUAL_HEIGHT;

    const spriteW = gameState.spriteImg ? gameState.spriteImg.naturalWidth * scale * 0.2 : OBSTACLE_SIZE;
    const spriteH = gameState.spriteImg ? gameState.spriteImg.naturalHeight : OBSTACLE_SIZE;

    let playerAABB: AABB = {
      minX: gameState.playerX,
      maxX: gameState.playerX + spriteW,
      minY: gameState.groundY - (spriteH * scale) - gameState.playerY,
      maxY: gameState.groundY - gameState.playerY
    };

    let obstacleAABB: AABB = {
      minX: obstacle.posX,
      maxX: obstacle.posX + obstacle.scaleX,
      minY: gameState.groundY - obstacle.scaleY,
      maxY: gameState.groundY
    };

    if (checkAABB(playerAABB, obstacleAABB)) {
      playerLose(gameState);
    }
  }

  const CLIP_DISTANCE = -100;
  while (gameState.obstacles.length > 0 && gameState.obstacles[0].posX <= CLIP_DISTANCE) {
    gameState.obstacles.shift();
  }
}

function updateGame(gameState: GameState, canvas: HTMLCanvasElement) {
  if (gameState.phase == "dead") {
    return;
  }

  const currentTime = performance.now();
  const delta = currentTime - gameState.lastTime;
  gameState.lastTime = currentTime;

  gameState.score += delta * 0.01;

  if (gameState.score >= gameState.nextFlashTime) {
    gameState.flashTimer += delta * 0.01;
  }
  if (gameState.score > gameState.nextFlashTime + 10) {
    gameState.gameSpeed += 0.05;
    gameState.gameSpeed = Math.min(gameState.gameSpeed, MAX_GAME_SPEED);
    gameState.nextFlashTime += 100;
    gameState.flashTimer = 0;
    gameState.scoreVisible = true;
  }

  if (gameState.flashTimer >= 1) {
    gameState.scoreVisible = !gameState.scoreVisible;
    gameState.flashTimer = 0;
  }

  gameState.bgX -= gameState.gameSpeed * delta;

  gameState.spawnTimer += delta;

  gameState.playerVY -= gameState.gravity * delta;

  updateObstacles(gameState, delta);

  if (gameState.jump && gameState.onGround) {
    gameState.playerVY = gameState.jumpVelocity;
  }

  gameState.playerY += gameState.playerVY;

  if (gameState.playerY <= 0) {
    gameState.playerY = -0.001;
    gameState.playerVY = -0.001;
    gameState.onGround = true;
  } else {
    gameState.onGround = false;
  }

  if (gameState.spawnTimer >= gameState.nextSpawnTime) {
    spawnObstacle(gameState);
    getNextSpawnTime(gameState);
  }
}

function startGame(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.phase = "running";
  gameState.lastTime = performance.now();
  gameState.playerX = Math.round(VIRTUAL_WIDTH * 0.12);

  // Ground — 2px white bar at 82% of virtual height
  gameState.groundY = Math.round(VIRTUAL_HEIGHT * 0.82);

  getNextSpawnTime(gameState);
  requestAnimationFrame(() => drawScene(canvas, gameState));
}

function endGame(gameState: GameState) {
  const sprite = gameState.spriteImg
  const bg = gameState.bgImg
  const trees = gameState.treeImgs
  Object.assign(gameState, createDefaultGameState())
  gameState.spriteImg = sprite
  gameState.bgImg = bg
  gameState.treeImgs = trees
}

export default function VGDCGame({ isActive }: VGDCGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<GameState>(createDefaultGameState());

  useEffect(() => {
    const img = new Image()
    img.onload = () => { gameRef.current.spriteImg = img }
    img.src = "/logos/Vivi.png"
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => { gameRef.current.bgImg = img }
    img.src = "/bg.png"
  }, [])

  useEffect(() => {
    const srcs = ["/logos/Tree1.png", "/logos/Tree2.png", "/logos/Tree3.png"]
    srcs.forEach((src, i) => {
      const img = new Image()
      img.onload = () => { gameRef.current.treeImgs[i] = img }
      img.src = src
    })
  }, [])

  // ResizeObserver: keeps the canvas pixel buffer matched to its CSS layout size.
  // Without this, canvas.width/height defaults to 300x150 regardless of CSS.
  // Also redraws the scene whenever the window resizes so nothing stretches.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / VIRTUAL_WIDTH, height / VIRTUAL_HEIGHT);
      canvas.width = VIRTUAL_WIDTH;
      canvas.height = VIRTUAL_HEIGHT;
      canvas.style.width = VIRTUAL_WIDTH * scale + "px";
      canvas.style.height = VIRTUAL_HEIGHT * scale + "px";
      drawScene(canvas, gameRef.current);
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, [])

  // Input listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code == "Space") gameRef.current.jump = true;
      if (e.code == "ArrowUp") gameRef.current.jump = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code == "Space") gameRef.current.jump = false;
      if (e.code == "ArrowUp") gameRef.current.jump = false;
    };

    const onTouchStart = () => {
      gameRef.current.jump = true;
    };

    const onTouchEnd = () => {
      gameRef.current.jump = false;
    };

    const onMouseDown = () => {
      gameRef.current.jump = true;
    }

    const onMouseUp = () => {
      gameRef.current.jump = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // isActive hook — full game loop starts/stops here in the full implementation.
  // e.g.: if (isActive) startLoop() else stopLoop() / reset()
  useEffect(() => {
    if (isActive) {
      if (!canvasRef.current) return;
      startGame(canvasRef.current, gameRef.current);
    } else {
      let gameState = gameRef.current;
      endGame(gameState);
    }
  }, [isActive])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        aria-label="VGDC mini game"
      />
    </div>
  )
}
