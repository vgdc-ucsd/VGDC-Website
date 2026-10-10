"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/schemas/blog-post"
import { cx, toSlug, SubmitButton, FormRootErrors } from "./shared"
import { ImageUploadInput } from "./ImageUploadInput"
import { createBlogPost } from "@/lib/form-actions"

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

const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.link, color: "#f472b6", textDecoration: "underline" },
  { tag: [tags.url, tags.string], color: "#fbbf24" },
  { tag: [tags.processingInstruction, tags.labelName], color: "#fbbf24" },
  { tag: tags.heading, color: "#e5e7eb", fontWeight: "800" },
])

// TODO: Need to actually export markdown when publish button is clicked
function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [focused, setFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [previewPosition, setPreviewPosition] = useState<number | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const captionOffsets = getCaptionOffsets(value)

  useEffect(() => {
    if (focused || previewPosition === null || !previewRef.current) return

    const blocks = Array.from(previewRef.current.querySelectorAll<HTMLElement>("[data-markdown-start]"))
      .map((element) => ({
        element,
        offset: Number(element.dataset.markdownStart),
      }))
      .filter(({ offset }) => Number.isFinite(offset) && offset <= previewPosition)

    blocks.at(-1)?.element.scrollIntoView({ block: "center" })
  }, [focused, previewPosition, value])

  useEffect(() => {
    if (!focused || !editorRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        selection: { anchor: Math.min(cursorPosition ?? value.length, value.length) },
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
          EditorView.theme({
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
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString())
          }),
        ],
      }),
      parent: editorRef.current,
    })

    viewRef.current = view
    if (cursorPosition !== null) {
      view.dispatch({
        effects: EditorView.scrollIntoView(cursorPosition, { y: "center" }),
      })
    }
    view.contentDOM.focus({ preventScroll: true })

    return () => {
      viewRef.current = null
      view.destroy()
    }
  }, [focused])

  if (!focused) {
    return (
      <div
        ref={previewRef}
        className={`${cx.textarea} min-h-64 cursor-text overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base`}
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onMouseDown={(event) => {
          const target = event.target
          const element = target instanceof Element
            ? target.closest<HTMLElement>("[data-markdown-start]")
            : null
          const offset = element?.dataset.markdownStart

          setCursorPosition(offset !== undefined ? Number(offset) : value.length)
          setFocused(true)
          event.preventDefault()
        }}
      >
        {value ? (
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
        ) : (
          <span className="text-text-grey/50">Write your post in Markdown…</span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`${cx.textarea} min-h-64 overflow-y-auto p-4 font-sans text-sm text-text-grey md:text-base [&_.cm-editor]:min-h-56 [&_.cm-editor]:outline-none`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPreviewPosition(viewRef.current?.state.selection.main.head ?? 0)
          setFocused(false)
        }
      }}
    >
      <div ref={editorRef} />
    </div>
  )
}

export default function BlogPostForm() {
  const [authors, setAuthors] = useState<string[]>([""])
  const [markdown, setMarkdown] = useState("")
  const [pendingUploads, setPendingUploads] = useState(0);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: { title: "", subtitle: "", date: "", coverCaption: "", slug: "", postData: "" },
  })

  function onTitleChange(value: string) {
    form.setValue("title", value, { shouldDirty: true });
    if (!form.getFieldState("slug").isDirty) {
      form.setValue("slug", toSlug(value));
    }
  }

  async function onSubmit(values: BlogPostFormValues) {
    form.clearErrors("root");
    const result = await createBlogPost({ ...values, authors });
    if (!result.ok) {
      form.setError(result.field ?? "root", { message: result.error });
      return;
    }
    form.reset();
    setAuthors([]);
  }

  return (
    <div className="relative">
      {/* TODO implement blog post image file uploading
      <aside className="absolute right-full top-0 mr-6">
        <ImageFileList />
      </aside>
      */}

      <div className={cx.card}>
        <h3 className="mb-6 text-xl font-bold text-white">Write Blog Post</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Title</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => onTitleChange(e.target.value)} placeholder="e.g. Devlog #3: Polishing the Combat System" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="subtitle" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Subtitle</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A short summary shown in the post listing" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Authors */}
            <div className="space-y-2">
              <p className="text-sm text-text-grey">Authors</p>
              <div className="space-y-2">
                {authors.map((author, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={author}
                      onChange={(e) => setAuthors((prev) => prev.map((a, idx) => idx === i ? e.target.value : a))}
                      placeholder={`Author ${i + 1}`}
                      className={cx.input}
                    />
                    {authors.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => setAuthors((prev) => prev.filter((_, idx) => idx !== i))} className={`shrink-0 ${cx.btn}`}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={() => setAuthors((prev) => [...prev, ""])} className={`text-sm ${cx.btn}`}>
                + Add Author
              </Button>
            </div>

            <FormField control={form.control} name="coverImage" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Cover Image</FormLabel>
                <FormControl>
                  <ImageUploadInput
                    folder="blogs"
                    multiple={false}
                    paths={field.value ? [field.value] : []}
                    onUploaded={([path]) => field.onChange(path)}
                    onError={(message) => form.setError("coverImage", { message })}
                    onBusyChange={(busy) => {
                      if (busy) form.clearErrors("coverImage")
                      setPendingUploads((count) => count + (busy ? 1 : -1))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="coverCaption" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Cover Caption <span className="text-text-grey/50">(optional)</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Caption displayed below the cover image" className={cx.input} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. devlog-3-combat-system" className={cx.input} />
                </FormControl>
                <FormDescription className={cx.hint}>Auto-generated from the title. Used in the URL.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="postData" render={({ field }) => (
              <FormItem>
                <FormLabel className={cx.label}>Content</FormLabel>
                <FormControl>
                  <MarkdownEditor
                    value={markdown}
                    onChange={(value) => {
                      setMarkdown(value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormDescription className={cx.hint}>Markdown supported.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormRootErrors formErrors={form.formState.errors} />

            <SubmitButton label="Publish Post" disabled={pendingUploads > 0 || form.formState.isSubmitting} />
          </form>
        </Form>
      </div>
    </div>
  )
}
