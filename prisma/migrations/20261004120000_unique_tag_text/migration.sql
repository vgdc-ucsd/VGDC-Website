-- Make EventTags.text and GameTags.text unique.
-- Existing duplicates (same text) are merged into the oldest tag first:
-- links to the duplicates are moved to the kept tag, then the duplicates are deleted.

-- EventTags ------------------------------------------------------------------
-- Move each link to the kept (lowest id) tag with the same text.
-- ON CONFLICT: the event may already be linked to the kept tag.
INSERT INTO "_EventToEventTags" ("A", "B")
SELECT link."A", keep.id
FROM "_EventToEventTags" link
JOIN "EventTags" dup  ON dup.id = link."B"
JOIN "EventTags" keep ON keep.text = dup.text
WHERE keep.id = (SELECT MIN(id) FROM "EventTags" t WHERE t.text = dup.text)
  AND dup.id <> keep.id
ON CONFLICT DO NOTHING;

-- Delete the duplicates (their old links go with them via ON DELETE CASCADE)
DELETE FROM "EventTags" dup
USING "EventTags" keep
WHERE dup.text = keep.text AND dup.id > keep.id;

CREATE UNIQUE INDEX "EventTags_text_key" ON "EventTags"("text");

-- GameTags -------------------------------------------------------------------
INSERT INTO "_GameToGameTags" ("A", "B")
SELECT link."A", keep.id
FROM "_GameToGameTags" link
JOIN "GameTags" dup  ON dup.id = link."B"
JOIN "GameTags" keep ON keep.text = dup.text
WHERE keep.id = (SELECT MIN(id) FROM "GameTags" t WHERE t.text = dup.text)
  AND dup.id <> keep.id
ON CONFLICT DO NOTHING;

DELETE FROM "GameTags" dup
USING "GameTags" keep
WHERE dup.text = keep.text AND dup.id > keep.id;

CREATE UNIQUE INDEX "GameTags_text_key" ON "GameTags"("text");
