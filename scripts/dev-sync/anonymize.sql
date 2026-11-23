-- Runs after every `pnpm db:pull`. Scrubs personal data that shouldn't be copied
-- onto contributors' machines. Officer names and bios are already public on the
-- site, so they're kept; members' names and everyone's Discord handles aren't.
-- Add a line here whenever a migration adds a column with personal data.

UPDATE "User" SET "discordID" = 'user-' || id;
UPDATE "User" SET name = 'Member ' || id WHERE role = 'MEMBER';
