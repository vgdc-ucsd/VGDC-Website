"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from "react"
import { EditorState } from "@codemirror/state"
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { styleTags, tags } from "@lezer/highlight"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { BookOpen, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cx } from "./shared"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  // Shown under the editor only in full screen, where the overlay hides the rest of the form
  fullScreenFooter?: ReactNode
}

function markdownOffset(node: { position?: { start?: { offset?: number } } } | undefined) {
  return node?.position?.start?.offset
}

function getCaptionOffsets(markdown: string) {
  const captionOffsets = new Set<number>()
  const lines = markdown.split("\n")

  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(lines[index])) {
      let captionIndex = index + 1
      if (lines[captionIndex]?.trim() === "") captionIndex += 1

      const caption = lines[captionIndex]?.match(/^\s*(\*\*\*|___|\*\*|__|\*|_)(.+?)\1\s*$/)
      if (caption) {
        const captionStart = lines.slice(0, captionIndex).reduce((total, line) => total + line.length + 1, 0)
        captionOffsets.add(captionStart + lines[captionIndex].indexOf(caption[1]))
      }
    }
  }

  return captionOffsets
}

// Last rendered block that starts at or before `offset` in the markdown source
function findPreviewBlock(container: HTMLElement, offset: number) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-markdown-start]"))
    .filter((element) => {
      const start = Number(element.dataset.markdownStart)
      return Number.isFinite(start) && start <= offset
    })
    .at(-1)
}

// Source offset of the preview block under a mouse event target
function previewOffsetAt(target: EventTarget) {
  const element = target instanceof Element
    ? target.closest<HTMLElement>("[data-markdown-start]")
    : null
  const offset = element?.dataset.markdownStart
  return offset !== undefined ? Number(offset) : null
}

const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.link, color: "#f472b6", textDecoration: "underline" },
  { tag: [tags.url, tags.string], color: "#fbbf24" },
  { tag: [tags.processingInstruction, tags.labelName], color: "#fbbf24" },
  { tag: tags.heading, color: "#e5e7eb", fontWeight: "800" },
])

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "#171923",
    color: "#e5e7eb",
    fontFamily: "inherit",
    fontSize: "inherit",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: "1.5",
  },
  ".cm-content": {
    caretColor: "#5eead4",
    minHeight: "14rem",
    padding: "0",
  },
  ".cm-cursor": {
    borderLeftColor: "#5eead4",
    borderLeftWidth: "2px",
  },
  ".cm-gutters": {
    backgroundColor: "#111827",
    border: "0",
    color: "#9ca3af",
    paddingRight: "0.75rem",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "rgba(59, 130, 246, 0.18)",
  },
  ".cm-activeLineGutter": {
    color: "#f9fafb",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(45, 212, 191, 0.3)",
  },
})

type CodeMirrorOptions = {
  // Mounts the editor into `parentRef` while true; any change to `mountKey` remounts it
  active: boolean
  mountKey: string
  value: string
  initialCursor: number | null
  onChange: (value: string) => void
  onCursor: (position: number) => void
}

function useCodeMirror(parentRef: RefObject<HTMLDivElement>, options: CodeMirrorOptions) {
  const { active, mountKey, value, initialCursor } = options
  const viewRef = useRef<EditorView | null>(null)
  // Last document the editor reported, so its own edits coming back as `value` are skipped
  const lastEmittedRef = useRef(value)
  // Callbacks live in a ref so a new closure each render doesn't rebuild the editor
  const callbacksRef = useRef(options)
  useLayoutEffect(() => {
    callbacksRef.current = options
  })

  useEffect(() => {
    if (!active || !parentRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        selection: { anchor: Math.min(initialCursor ?? value.length, value.length) },
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          EditorView.lineWrapping,
          history(),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          markdown({
            base: markdownLanguage,
            extensions: { props: [styleTags({ "Link/URL": tags.url })] },
          }),
          syntaxHighlighting(markdownHighlightStyle),
          editorTheme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              lastEmittedRef.current = update.state.doc.toString()
              callbacksRef.current.onChange(lastEmittedRef.current)
            }
            if (update.docChanged || update.selectionSet) {
              callbacksRef.current.onCursor(update.state.selection.main.head)
            }
          }),
        ],
      }),
      parent: parentRef.current,
    })

    viewRef.current = view
    lastEmittedRef.current = value
    if (initialCursor !== null) {
      view.dispatch({
        effects: EditorView.scrollIntoView(Math.min(initialCursor, value.length), { y: "center" }),
      })
    }
    view.contentDOM.focus({ preventScroll: true })

    return () => {
      viewRef.current = null
      view.destroy()
    }
  }, [active, mountKey])

  // Pull in changes made outside the editor, e.g. the form resetting after publish
  useEffect(() => {
    const view = viewRef.current
    if (view && value !== lastEmittedRef.current) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
    }
  }, [value])

  return viewRef
}

function MarkdownPreview({ value }: { value: string }) {
  const captionOffsets = getCaptionOffsets(value)

  if (!value) return <span className="text-text-grey/50">Write your post in Markdown…</span>

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children, node }) => <div className="my-4" data-markdown-start={markdownOffset(node)}>{children}</div>,
          a: ({ children, href }) => <a href={href} className="text-hot-pink" target="_blank">{children}</a>,
          em: ({ children, node }) => (
            <em className={captionOffsets.has(markdownOffset(node) ?? -1) ? "mt-2 block w-full text-center" : undefined}>
              {children}
            </em>
          ),
          h1: ({ children, node }) => <h2 className="mb-0 translate-y-1 text-[1.8rem] font-extrabold leading-9 text-gray-200" data-markdown-start={markdownOffset(node)}>{children}</h2>,
          h2: ({ children, node }) => <h2 className="mb-0 translate-y-1 text-2xl font-extrabold leading-8 text-gray-200" data-markdown-start={markdownOffset(node)}>{children}</h2>,
          h3: ({ children, node }) => <h2 className="mb-0 translate-y-1 text-[1.2rem] font-extrabold leading-7 text-gray-200" data-markdown-start={markdownOffset(node)}>{children}</h2>,
          img: ({ src, alt, node }) => <img src={src} alt={alt || ""} className="max-w-full" data-markdown-start={markdownOffset(node)} />,
          code({ children, className, node }) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match?.[1] === "tsx" ? "jsx" : match?.[1] || "text"

            return (
              <div data-markdown-start={markdownOffset(node)}>
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{ borderRadius: "12px", margin: "16px 0" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            )
          },
        }}
      >{value}</ReactMarkdown>
    </div>
  )
}

// Syntax cheat sheet shown from the "Markdown help" button; matches what MarkdownPreview renders
const markdownGuide: { label: string; syntax: string; note?: string }[] = [
  { label: "Headings", syntax: "# Big\n## Medium\n### Small", note: "Only 1–3 #'s are styled." },
  { label: "Paragraphs", syntax: "First paragraph.\n\nSecond paragraph.", note: "Leave a blank line between paragraphs; a single line break joins them." },
  { label: "Bold / italic", syntax: "**bold**  *italic*  ***both***" },
  { label: "Link", syntax: "[VGDC](https://www.vgdc.dev)" },
  { label: "Image with caption", syntax: "![Alt text](/images/shot.png)\n*Figure 1: caption*", note: "An italic line right under an image is centered as its caption." },
  { label: "Code block", syntax: "```python\nprint(\"hello\")\n```", note: "Add a language after the backticks for coloring (ts, tsx, python, cpp, csharp…)." },
  { label: "Lists", syntax: "- Item\n  - Nested\n1. Step one\n2. Step two" },
  { label: "Quote", syntax: "> Make it fun first." },
  { label: "Divider", syntax: "---" },
  { label: "HTML", syntax: "<p align=\"center\"><b>Centered</b></p>", note: "Raw HTML is allowed." },
  { label: "Emoji", syntax: "🔥 ✨ 🚀", note: "Type or paste emoji (Win + . on Windows); :shortcodes: aren't converted." },
]

function MarkdownGuide() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-semibold text-white">Markdown cheat sheet</p>
      {markdownGuide.map(({ label, syntax, note }) => (
        <div key={label}>
          <p className="mb-1 text-gray-200">{label}</p>
          <pre className="whitespace-pre-wrap rounded bg-black px-2 py-1.5 font-mono text-xs text-[#fbbf24]">{syntax}</pre>
          {note && <p className={`mt-1 ${cx.hint}`}>{note}</p>}
        </div>
      ))}
      <p className={cx.hint}>Not supported: tables, ~~strikethrough~~, task lists.</p>
    </div>
  )
}

// TODO: Need to actually export markdown when publish button is clicked
export function MarkdownEditor({ value, onChange, fullScreenFooter }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"live" | "split">("live")
  const [expanded, setExpanded] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  // Caret position in the markdown source, shared by the editor and the preview
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const switchId = useId()
  const split = mode === "split"

  const viewRef = useCodeMirror(editorRef, {
    active: split || focused,
    mountKey: mode,
    value,
    initialCursor: cursorPosition,
    onChange,
    onCursor: setCursorPosition,
  })

  // Keep the preview on the block being edited
  useEffect(() => {
    // Skip while hidden (e.g. another dashboard tab is open) so the page doesn't scroll behind it
    if (cursorPosition === null || !previewRef.current || previewRef.current.getClientRects().length === 0) return

    if (split) {
      const container = previewRef.current
      const block = findPreviewBlock(container, cursorPosition)
      if (!block) return
      // Scroll only the preview pane so the page itself doesn't jump while typing
      const top = block.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
      container.scrollTo({ top: top - (container.clientHeight - block.offsetHeight) / 2 })
    } else if (!focused) {
      findPreviewBlock(previewRef.current, cursorPosition)?.scrollIntoView({ block: "center" })
    }
  }, [split, focused, cursorPosition, value])


  // Full screen: Esc exits (unless it's meant for the editor or the help popover),
  // and the page behind stops scrolling
  useEffect(() => {
    if (!expanded) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || helpOpen) return
      if (editorRef.current?.contains(document.activeElement)) return
      setExpanded(false)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [expanded, helpOpen])

  // Toolbar buttons keep focus in the editor so live mode doesn't drop back to the preview
  const keepFocus = (event: MouseEvent) => event.preventDefault()
  const paneSize = expanded ? "h-full" : "h-[32rem]"

  return (
    <div className={expanded ? "fixed inset-0 z-[100] flex flex-col bg-background-black p-4 md:p-8" : undefined}>
      <div className="mb-2 flex items-center justify-end gap-2">
        <Popover open={helpOpen} onOpenChange={setHelpOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" onMouseDown={keepFocus} className={`gap-1.5 ${cx.btn}`}>
              <BookOpen className="h-4 w-4" /> Markdown help
            </Button>
          </PopoverTrigger>
          {/* The popover never takes focus, so an open editor stays open while reading it */}
          <PopoverContent
            align="end"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onMouseDown={keepFocus}
            className="z-[110] max-h-[70vh] w-[22rem] overflow-y-auto border-white/20 bg-background-grey p-4 text-text-grey"
          >
            <MarkdownGuide />
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={keepFocus}
          onClick={() => setExpanded((value) => !value)}
          className={`gap-1.5 ${cx.btn}`}
          aria-label={expanded ? "Exit full screen" : "Full screen"}
        >
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {expanded ? "Exit full screen" : "Full screen"}
        </Button>
        <label htmlFor={switchId} className="ml-2 text-sm text-text-grey">Side-by-side</label>
        <Switch
          id={switchId}
          checked={split}
          onCheckedChange={(checked) => {
            setFocused(false)
            setMode(checked ? "split" : "live")
          }}
          className={cx.switch}
        />
      </div>

      {split ? (
        <div className={`grid gap-4 md:grid-cols-2 ${expanded ? "min-h-0 flex-1 auto-rows-[minmax(0,1fr)]" : ""}`}>
          <div
            ref={editorRef}
            className={`${cx.textarea} ${paneSize} overflow-hidden p-4 font-sans text-sm text-text-grey md:text-base [&_.cm-editor]:h-full [&_.cm-editor]:outline-none`}
          />
          <div
            ref={previewRef}
            className={`${cx.textarea} ${paneSize} cursor-text overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base`}
            onMouseDown={(event) => {
              const view = viewRef.current
              const offset = previewOffsetAt(event.target)
              if (!view || offset === null) return

              const anchor = Math.min(offset, view.state.doc.length)
              view.dispatch({
                selection: { anchor },
                effects: EditorView.scrollIntoView(anchor, { y: "center" }),
              })
              view.focus()
              event.preventDefault()
            }}
          >
            <MarkdownPreview value={value} />
          </div>
        </div>
      ) : !focused ? (
        <div
          ref={previewRef}
          className={`${cx.textarea} ${expanded ? "min-h-0 flex-1" : "min-h-64"} cursor-text overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base`}
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onMouseDown={(event) => {
            setCursorPosition(previewOffsetAt(event.target) ?? value.length)
            setFocused(true)
            event.preventDefault()
          }}
        >
          <MarkdownPreview value={value} />
        </div>
      ) : (
        <div
          className={`${cx.textarea} ${expanded ? "min-h-0 flex-1" : "min-h-64"} overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base [&_.cm-editor]:min-h-56 [&_.cm-editor]:outline-none`}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
          }}
        >
          <div ref={editorRef} />
        </div>
      )}

      {expanded && fullScreenFooter}
    </div>
  )
}
