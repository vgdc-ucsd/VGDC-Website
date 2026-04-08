"use client"

import { useState } from "react"
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

// ── Tag chip input ────────────────────────────────────────────────────────────
export type Tag = { text: string; color: string }

export function TagInput({
  tags,
  onChange,
}: {
  tags: Tag[]
  onChange: (tags: Tag[]) => void
}) {
  const [text, setText] = useState("")
  const [color, setColor] = useState("#297892")

  function add() {
    const trimmed = text.trim()
    if (!trimmed) return
    onChange([...tags, { text: trimmed, color }])
    setText("")
  }

  function remove(i: number) {
    onChange(tags.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-grey">Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-black"
            style={{ backgroundColor: tag.color }}
          >
            {tag.text}
            <button type="button" onClick={() => remove(i)} className="ml-1 opacity-70 hover:opacity-100">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder="Tag label"
          className={cx.input}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-white/20 bg-black p-1"
          title="Tag color"
        />
        <Button type="button" variant="outline" onClick={add} className={cx.btn}>Add</Button>
      </div>
    </div>
  )
}

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
