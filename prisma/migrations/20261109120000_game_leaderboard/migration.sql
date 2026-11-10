-- CreateEnum
CREATE TYPE "Mascot" AS ENUM ('VIVI', 'CICI', 'DOUG', 'GIGI');

-- CreateTable
CREATE TABLE "GameRun" (
    "id" TEXT NOT NULL,
    "mascot" "Mascot" NOT NULL,
    "discordId" TEXT,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMPTZ(3),

    CONSTRAINT "GameRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "discordId" TEXT,
    "mascot" "Mascot" NOT NULL,
    "score" INTEGER NOT NULL,
    "achievedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameRun_startedAt_idx" ON "GameRun"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_discordId_key" ON "LeaderboardEntry"("discordId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_score_idx" ON "LeaderboardEntry"("score" DESC);

