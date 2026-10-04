-- Replace Event.date + startTime + endTime with startTimestamp + endTimestamp.
--
-- Hand-written so existing rows are converted instead of dropped: Prisma's
-- generated version would drop the old columns and add new NOT NULL ones,
-- which fails on (or wipes) a table that already has events.
--
-- The old columns hold Pacific wall-clock values with no time zone
-- (lib/events.ts reads startTime/endTime with moment.utc() and shows them as-is).
-- "timestamp AT TIME ZONE 'America/Los_Angeles'" interprets them as Pacific
-- local time, handling PST/PDT for each event's own date.

-- 1. Add the new columns as nullable so existing rows can be filled in
ALTER TABLE "Event"
ADD COLUMN "startTimestamp" TIMESTAMPTZ(3),
ADD COLUMN "endTimestamp" TIMESTAMPTZ(3);

-- 2. Convert existing rows. An end time earlier than the start time means the
--    event runs past midnight, so it ends on the next day.
UPDATE "Event"
SET
  "startTimestamp" = ("date" + "startTime") AT TIME ZONE 'America/Los_Angeles',
  "endTimestamp" = (
    ("date" + "endTime")
    + CASE WHEN "endTime" < "startTime" THEN INTERVAL '1 day' ELSE INTERVAL '0' END
  ) AT TIME ZONE 'America/Los_Angeles';

-- 3. Every row now has values; make them required like the schema says
ALTER TABLE "Event"
ALTER COLUMN "startTimestamp" SET NOT NULL,
ALTER COLUMN "endTimestamp" SET NOT NULL;

-- 4. Drop the old columns
ALTER TABLE "Event"
DROP COLUMN "date",
DROP COLUMN "startTime",
DROP COLUMN "endTime";
