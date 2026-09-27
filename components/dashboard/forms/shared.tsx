"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ── Shared Tailwind class strings ─────────────────────────────────────────────
export const cx = {
  input:    "border-white/20 bg-black text-white placeholder:text-text-grey/50 focus-visible:ring-vgdc-light-blue",
  textarea: "border-white/20 bg-black text-white placeholder:text-text-grey/50 focus-visible:ring-vgdc-light-blue resize-none",
  file:     "border-white/20 bg-black text-text-grey file:mr-3 file:border-0 file:bg-background-grey file:text-text-grey focus-visible:ring-vgdc-light-blue cursor-pointer",
  label:    "text-text-grey",
  hint:     "text-text-grey/60 text-xs",
  btn:      "border-white/20 bg-black text-text-grey hover:text-white hover:bg-black",
  card:     "rounded-lg bg-background-grey p-6",
}

// ── Slug helper ───────────────────────────────────────────────────────────────
export function toSlug(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// ── Tag presets (separate pools for games vs events, persisted in localStorage)
export type Tag = { text: string; color: string }
export type TagType = "game" | "event"

const STORAGE_KEYS: Record<TagType, string> = {
  game:  "vgdc-tag-presets-game",
  event: "vgdc-tag-presets-event",
}

const DEFAULT_PRESETS: Record<TagType, Tag[]> = {
  game: [
    { text: "Unreleased", color: "#5ec269" },
    { text: "Released", color: "#e2b53e" },
    { text: "Web", color: "#4e80ee" },
  ],
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

function loadPresets(type: TagType): Tag[] {
  if (typeof window === "undefined") return DEFAULT_PRESETS[type]
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[type])
    return stored ? (JSON.parse(stored) as Tag[]) : DEFAULT_PRESETS[type]
  } catch {
    return DEFAULT_PRESETS[type]
  }
}

function savePresets(type: TagType, presets: Tag[]) {
  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(presets))
}

// ── Tag chip input ────────────────────────────────────────────────────────────
export function TagInput({
  type,
  tags,
  onChange,
}: {
  type: TagType
  tags: Tag[]
  onChange: (tags: Tag[]) => void
}) {
  const [presets, setPresets] = useState<Tag[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newText, setNewText] = useState("")
  const [newColor, setNewColor] = useState("#297892")

  useEffect(() => { setPresets(loadPresets(type)) }, [type])

  function isSelected(preset: Tag) {
    return tags.some((t) => t.text === preset.text && t.color === preset.color)
  }

  function togglePreset(preset: Tag) {
    if (isSelected(preset)) {
      onChange(tags.filter((t) => !(t.text === preset.text && t.color === preset.color)))
    } else {
      onChange([...tags, preset])
    }
  }

  function saveNewPreset() {
    const trimmed = newText.trim()
    if (!trimmed) return
    const preset: Tag = { text: trimmed, color: newColor }
    const updated = [...presets, preset]
    setPresets(updated)
    savePresets(type, updated)
    onChange([...tags, preset]) // auto-select the new tag
    setNewText("")
    setShowNew(false)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-grey">Tags</p>

      {/* Preset chips — click to toggle selected */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, i) => {
          const selected = isSelected(preset)
          return (
            <button
              key={i}
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
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="rounded-full border border-dashed border-white/30 px-3 py-1 text-xs text-text-grey transition-colors hover:border-white/60 hover:text-white"
        >
          {showNew ? "Cancel" : "+ New tag"}
        </button>
      </div>

      {/* Inline new-preset form */}
      {showNew && (
        <div className="flex gap-2 items-center rounded-md border border-white/10 bg-black p-3">
          <Input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveNewPreset() } }}
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
          <Button type="button" onClick={saveNewPreset} className="h-8 bg-vgdc-light-green text-black text-xs px-3 hover:opacity-90">
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Disabled submit with "Not working yet" note ───────────────────────────────
export function SubmitButton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled className="bg-vgdc-light-green text-black font-medium opacity-50 cursor-not-allowed">
        {label}
      </Button>
      <span className={cx.hint}>Not working yet*</span>
    </div>
  )
}
