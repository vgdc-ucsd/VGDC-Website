BEGIN;

-- Only signed-in players keep leaderboard entries.
DELETE FROM "LeaderboardEntry" WHERE "discordId" IS NULL;

-- Replace existing public Discord names while preserving personal bests.
UPDATE "LeaderboardEntry"
SET "displayName" = lower("mascot"::text) || (floor(random() * 90000)::int + 10000)::text;

ALTER TABLE "LeaderboardEntry" ALTER COLUMN "discordId" SET NOT NULL;

DROP TABLE "GameRun";

COMMIT;
