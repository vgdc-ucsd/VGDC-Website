CREATE TYPE "Mascot" AS ENUM ('VIVI', 'CICI', 'DOUG', 'GIGI');

CREATE TABLE "LeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "mascot" "Mascot" NOT NULL,
    "score" INTEGER NOT NULL,
    "achievedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeaderboardEntry_discordId_key" ON "LeaderboardEntry"("discordId");
CREATE INDEX "LeaderboardEntry_score_idx" ON "LeaderboardEntry"("score" DESC);
