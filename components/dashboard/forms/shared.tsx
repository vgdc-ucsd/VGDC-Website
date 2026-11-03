"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { eventTagInputSchema, type EventTagInput } from "@/lib/schemas/event"
import { gameTagInputSchema, type GameTagInput } from "@/lib/schemas/game"
import { FieldErrors, FieldValues, Form } from "react-hook-form"
import { deleteTag, getSavedTags, updateTag } from "@/lib/form-actions"

// ── Shared Tailwind class strings ─────────────────────────────────────────────
export const cx = {
  input:    "border-white/20 bg-black text-white placeholder:text-text-grey/50 focus-visible:ring-vgdc-light-blue",
  textarea: "border-white/20 bg-black text-white placeholder:text-text-grey/50 focus-visible:ring-vgdc-light-blue resize-none",
  file:     "border-white/20 bg-black text-text-grey file:mr-3 file:border-0 file:bg-background-grey file:text-text-grey focus-visible:ring-vgdc-light-blue cursor-pointer",
  label:    "text-text-grey",
  hint:     "text-text-grey/60 text-xs",
  btn:      "border-white/20 bg-black text-text-grey hover:text-white hover:bg-black",
  card:     "rounded-lg bg-background-grey p-6",
  switch:   "data-[state=checked]:bg-vgdc-light-green data-[state=unchecked]:bg-white/15 focus-visible:ring-vgdc-light-blue focus-visible:ring-offset-background-grey [&>span]:bg-gray-200 data-[state=unchecked]:[&>span]:bg-text-grey",
}

// ── Slug helper ───────────────────────────────────────────────────────────────
export function toSlug(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// ── Tag presets (separate pools for games vs events, persisted in localStorage)
// Tag types and schemas are derived from the Prisma models in lib/schemas.
type TagTypes = {
  game:  GameTagInput
  event: EventTagInput
}
export type TagType = keyof TagTypes

const TAG_LIST_SCHEMAS: { [T in TagType]: z.ZodType<TagTypes[T][], z.ZodTypeDef, unknown> } = {
  game:  z.array(gameTagInputSchema),
  event: z.array(eventTagInputSchema),
}

const STORAGE_KEYS: Record<TagType, string> = {
  game:  "vgdc-tag-presets-game",
  event: "vgdc-tag-presets-event",
}

const DEFAULT_PRESETS: { [T in TagType]: TagTypes[T][] } = {
  // Status and web-playability have their own fields (and badges), so they aren't offered as tags
  game: [],
  event: [
    { text: "Workshop",color: "#4e80ee" },
    { text: "Social",color: "#5ec269" },
    { text: "Game Jam",color: "#e2b53e" },
    { text: "Meeting",color: "#4e80ee" },
    { text: "Competition",color: "#e2b53e" },
    { text: "Showcase",color: "#5ec269" },
    { text: "Panel",color: "#4e80ee" },
  ],
}

// Names that can't be tags because another field already shows them as a badge
// (status and the Web Playable toggle have their own badges and the /games filters use them)
const RESERVED_TAG_NAMES: Record<TagType, string[]> = {
  game:  ["released", "unreleased", "prototype", "web"],
  event: [],
}

function isReservedTag(type: TagType, text: string) {
  return RESERVED_TAG_NAMES[type].includes(text.trim().toLowerCase())
}

function loadPresets<T extends TagType>(type: T): TagTypes[T][] {
  if (typeof window === "undefined") return DEFAULT_PRESETS[type]
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[type])
    if (!stored) return DEFAULT_PRESETS[type]
    // Stored data may be from an older version or edited by hand, so validate it
    const parsed = TAG_LIST_SCHEMAS[type].safeParse(JSON.parse(stored))
    if (!parsed.success) return DEFAULT_PRESETS[type]
    // Older versions offered status names as presets; drop them from saved lists
    return parsed.data.filter((p) => !isReservedTag(type, p.text))
  } catch {
    return DEFAULT_PRESETS[type]
  }
}

function savePresets<T extends TagType>(type: T, presets: TagTypes[T][]) {
  try {
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(presets))
  } catch {
    // Storage can be full or blocked (e.g. private browsing); presets just won't persist
  }
}

// Tag text is unique (case-insensitively, as far as the picker is concerned), so it identifies a tag
const keyOf = (tag: { text: string }) => tag.text.trim().toLowerCase()

// ── Tag chip input ────────────────────────────────────────────────────────────
export function TagInput<T extends TagType>({
  type,
  tags,
  onChange,
}: {
  type: T
  tags: TagTypes[T][]
  onChange: (tags: TagTypes[T][]) => void
}) {
  type Tag = TagTypes[T]
  const [presets, setPresets] = useState<Tag[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newText, setNewText] = useState("")
  const [newColor, setNewColor] = useState("#297892")
  const [managing, setManaging] = useState(false)
  // Tags are identified by lowercase text (unique per table), never by list position,
  // because the list is reordered once the saved tags arrive.
  // Key of the preset being edited in the inline form; null means the form adds a new preset
  const [editKey, setEditKey] = useState<string | null>(null)
  // Key of a saved, in-use tag whose × was clicked and is waiting for confirmation
  const [confirmKey, setConfirmKey] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  // Tags saved in the database (keyed by lowercase text) and how many games/events use each.
  // Everything else in `presets` exists only in this browser until it's used on a submission.
  const [uses, setUses] = useState<Map<string, number>>(new Map())
  // Manage mode needs to know which tags are saved, so it waits for them to load
  const [savedStatus, setSavedStatus] = useState<"loading" | "loaded" | "error">("loading")

  useEffect(() => {
    let cancelled = false
    const local = loadPresets(type)
    setPresets(local)
    setSavedStatus("loading")
    getSavedTags(type)
      .then((saved) => {
        if (cancelled) return
        const savedTags = saved.filter((t) => !isReservedTag(type, t.text))
        const savedKeys = new Set(savedTags.map((t) => keyOf(t)))
        setUses(new Map(savedTags.map((t) => [keyOf(t), t.uses])))
        setPresets([
          ...savedTags.map((t) => ({ text: t.text, color: t.color }) as Tag),
          ...local.filter((p) => !savedKeys.has(keyOf(p))),
        ])
        setSavedStatus("loaded")
      })
      .catch((error) => {
        if (cancelled) return
        console.error("Couldn't load saved tags", error)
        setSavedStatus("error")
      })
    return () => { cancelled = true }
  }, [type])

  const sameTag = (a: Tag, b: Tag) => a.text === b.text && a.color === b.color
  const isSaved = (preset: Tag) => uses.has(keyOf(preset))
  const findPreset = (key: string | null) => (key === null ? undefined : presets.find((p) => keyOf(p) === key))

  function isSelected(preset: Tag) {
    return tags.some((t) => sameTag(t, preset))
  }

  function togglePreset(preset: Tag) {
    if (isSelected(preset)) {
      onChange(tags.filter((t) => !sameTag(t, preset)))
    } else {
      onChange([...tags, preset])
    }
  }

  function updatePresets(updated: Tag[], savedUses = uses) {
    setPresets(updated)
    // Saved tags come from the database on load, so only browser-only ones go in localStorage
    savePresets(type, updated.filter((p) => !savedUses.has(keyOf(p))))
  }

  function closeForm() {
    setSaveError(null)
    setConfirmKey(null)
    setNewText("")
    setShowNew(false)
    setEditKey(null)
  }

  function startEdit(preset: Tag) {
    setConfirmKey(null)
    setSaveError(null)
    setEditKey(keyOf(preset))
    setNewText(preset.text)
    setNewColor(preset.color)
    setShowNew(true)
  }

  async function deletePreset(key: string) {
    const removed = findPreset(key)
    if (!removed || saving) return
    let nextUses = uses

    if (isSaved(removed)) {
      // A tag on existing games/events gets removed from them too, so ask first
      if ((uses.get(key) ?? 0) > 0 && confirmKey !== key) {
        setConfirmKey(key)
        return
      }
      setSaving(true)
      setSaveError(null)
      const result = await deleteTag(type, removed.text)
      setSaving(false)
      if (!result.ok) {
        setSaveError(result.error)
        return
      }
      nextUses = new Map(uses)
      nextUses.delete(key)
      setUses(nextUses)
    }

    updatePresets(presets.filter((p) => keyOf(p) !== key), nextUses)
    onChange(tags.filter((t) => !sameTag(t, removed)))
    closeForm()
  }

  async function savePreset() {
    const trimmed = newText.trim()
    if (!trimmed || isDuplicate || isReserved || saving) return
    const preset: Tag = { text: trimmed, color: newColor }

    if (editKey === null) {
      updatePresets([...presets, preset])
      onChange([...tags, preset]) // auto-select the new tag
    } else {
      const old = findPreset(editKey)
      if (!old) return closeForm()
      let nextUses = uses
      if (isSaved(old)) {
        // Update the saved tag first so games/events already using it change too
        setSaving(true)
        setSaveError(null)
        const result = await updateTag(type, old.text, preset)
        setSaving(false)
        if (!result.ok) {
          setSaveError(result.error)
          return
        }
        // Re-key its usage count under the new name
        nextUses = new Map(uses)
        const count = nextUses.get(editKey) ?? 0
        nextUses.delete(editKey)
        nextUses.set(keyOf(preset), count)
        setUses(nextUses)
      }
      updatePresets(presets.map((p) => (keyOf(p) === editKey ? preset : p)), nextUses)
      // Keep the edited tag selected if it was
      onChange(tags.map((t) => (sameTag(t, old) ? preset : t)))
    }
    closeForm()
  }

  // Tag text is unique in the database, so two presets can't share a name
  const isDuplicate = presets.some(
    (p) => keyOf(p) !== editKey && keyOf(p) === newText.trim().toLowerCase()
  )
  const isReserved = isReservedTag(type, newText)
  const pendingDelete = findPreset(confirmKey)
  const pendingUses = pendingDelete ? uses.get(keyOf(pendingDelete)) ?? 0 : 0

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-grey">Tags</p>

      {/* Preset chips — click to toggle selected, or (in manage mode) click to edit / × to delete */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const selected = isSelected(preset)
          if (managing) {
            return (
              <span
                key={keyOf(preset)}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{
                  backgroundColor: preset.color,
                  outline: editKey === keyOf(preset) ? "2px solid white" : "none",
                  outlineOffset: "2px",
                }}
              >
                <button type="button" onClick={() => startEdit(preset)} title={`Edit "${preset.text}"`}>
                  {preset.text}
                </button>
                <button
                  type="button"
                  onClick={() => deletePreset(keyOf(preset))}
                  className="leading-none opacity-70 hover:opacity-100"
                  aria-label={`Delete tag "${preset.text}"`}
                  title="Delete tag"
                >
                  ×
                </button>
              </span>
            )
          }
          return (
            <button
              key={keyOf(preset)}
              type="button"
              onClick={() => togglePreset(preset)}
              className="rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity"
              style={{
                backgroundColor: preset.color,
                opacity: selected ? 1 : 0.35,
                outline: selected ? `2px solid ${preset.color}` : "none",
                outlineOffset: "2px",
              }}
            >
              {preset.text}
            </button>
          )
        })}

        {/* New tag toggle */}
        {!managing && (
          <button
            type="button"
            onClick={() => (showNew ? closeForm() : setShowNew(true))}
            className="rounded-full border border-dashed border-white/30 px-3 py-1 text-xs text-text-grey transition-colors hover:border-white/60 hover:text-white"
          >
            {showNew ? "Cancel" : "+ New tag"}
          </button>
        )}

        {/* Manage mode toggle */}
        <button
          type="button"
          onClick={() => { closeForm(); setManaging((v) => !v) }}
          disabled={savedStatus !== "loaded"}
          className="px-1 py-1 text-xs text-text-grey underline-offset-2 transition-colors hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline"
        >
          {managing ? "Done" : savedStatus === "loading" ? "Loading tags…" : "Manage tags"}
        </button>
      </div>

      {savedStatus === "error" && (
        <p role="alert" className="text-xs text-destructive">
          Couldn&apos;t load the saved tags. Reload the page to see them and to manage tags.
        </p>
      )}

      {managing && !showNew && confirmKey === null && (
        <p className={cx.hint}>
          Click a tag to rename or recolor it, or × to delete it. Changes to tags already on games apply to those games too.
        </p>
      )}

      {/* Confirmation for deleting a tag that existing games/events use */}
      {pendingDelete && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-white/10 bg-black p-3 text-xs text-text-grey">
          <span>
            Delete &quot;{pendingDelete.text}&quot;? It&apos;s on {pendingUses} {type}{pendingUses === 1 ? "" : "s"} and
            will be removed from {pendingUses === 1 ? "it" : "them"}.
          </span>
          <Button
            type="button"
            onClick={() => deletePreset(keyOf(pendingDelete))}
            disabled={saving}
            className="h-8 bg-destructive px-3 text-xs text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Deleting…" : "Delete"}
          </Button>
          <Button type="button" onClick={() => setConfirmKey(null)} className={`h-8 px-3 text-xs ${cx.btn}`}>
            Cancel
          </Button>
        </div>
      )}

      {saveError && !showNew && <p role="alert" className="text-xs text-destructive">{saveError}</p>}

      {/* Inline form: adds a new preset, or edits the one at editKey */}
      {showNew && (
        <div className="space-y-2 rounded-md border border-white/10 bg-black p-3">
          <div className="flex gap-2 items-center">
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); savePreset() } }}
              placeholder="Tag name"
              className={`${cx.input} h-8 text-xs`}
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-white/20 bg-black p-1"
              title="Tag color"
            />
            <Button
              type="button"
              onClick={savePreset}
              disabled={!newText.trim() || isDuplicate || isReserved || saving}
              className="h-8 bg-vgdc-light-green text-black text-xs px-3 hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </Button>
            {editKey !== null && (
              <Button type="button" onClick={closeForm} className={`h-8 text-xs px-3 ${cx.btn}`}>
                Cancel
              </Button>
            )}
          </div>
          {isDuplicate && <p className="text-xs text-destructive">A tag with that name already exists.</p>}
          {isReserved && <p className="text-xs text-destructive">The game&apos;s Status or Web Playable field already shows this.</p>}
          {saveError && <p role="alert" className="text-xs text-destructive">{saveError}</p>}
        </div>
      )}
    </div>
  )
}

/** Errors that don't belong to a specific field */
export function FormRootErrors<TValues extends FieldValues>({ formErrors }: { formErrors: FieldErrors<TValues> }) {
  return (
    formErrors.root && (
      <p role="alert" className="text-sm font-medium text-destructive">
        {formErrors.root.message}
      </p>
    )
  )
}

// ── Disabled submit with "Not working yet" note ───────────────────────────────
export function SubmitButton({ label, disabled }: { label: string, disabled?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled={disabled} className="bg-vgdc-light-green text-black font-medium disabled:opacity-50">
        {label}
      </Button>
    </div>
  )
}
