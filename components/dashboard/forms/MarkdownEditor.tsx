"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react"
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
import { Switch } from "@/components/ui/switch"
import { cx } from "./shared"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
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
            if (update.docChanged) callbacksRef.current.onChange(update.state.doc.toString())
            if (update.docChanged || update.selectionSet) {
              callbacksRef.current.onCursor(update.state.selection.main.head)
            }
          }),
        ],
      }),
      parent: parentRef.current,
    })

    viewRef.current = view
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
    if (view && view.state.doc.toString() !== value) {
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

// TODO: Need to actually export markdown when publish button is clicked
export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"live" | "split">("live")
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
    if (cursorPosition === null || !previewRef.current) return

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

  const toggle = (
    <div className="mb-2 flex items-center justify-end gap-2">
      <label htmlFor={switchId} className="text-sm text-text-grey">Side-by-side</label>
      <Switch
        id={switchId}
        checked={split}
        onCheckedChange={(checked) => {
          setFocused(false)
          setMode(checked ? "split" : "live")
        }}
        className="data-[state=checked]:bg-vgdc-light-green data-[state=unchecked]:bg-white/15 focus-visible:ring-vgdc-light-blue focus-visible:ring-offset-background-grey [&>span]:bg-gray-200 data-[state=unchecked]:[&>span]:bg-text-grey"
      />
    </div>
  )

  if (split) {
    return (
      <div>
        {toggle}
        <div className="grid gap-4 md:grid-cols-2">
          <div
            ref={editorRef}
            className={`${cx.textarea} h-[32rem] overflow-hidden p-4 font-sans text-sm text-text-grey md:text-base [&_.cm-editor]:h-full [&_.cm-editor]:outline-none`}
          />
          <div
            ref={previewRef}
            className={`${cx.textarea} h-[32rem] cursor-text overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base`}
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
      </div>
    )
  }

  if (!focused) {
    return (
      <div>
        {toggle}
        <div
          ref={previewRef}
          className={`${cx.textarea} min-h-64 cursor-text overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base`}
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
      </div>
    )
  }

  return (
    <div>
      {toggle}
      <div
        className={`${cx.textarea} min-h-64 overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base [&_.cm-editor]:min-h-56 [&_.cm-editor]:outline-none`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
        }}
      >
        <div ref={editorRef} />
      </div>
    </div>
  )
}
