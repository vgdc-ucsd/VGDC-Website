import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { MAX_IMAGE_BYTES, MAX_IMAGE_MEGABYTES } from "@/lib/images.shared"
import { postImage } from "@/lib/images.client"
import { ImageMap } from "@/lib/blog_images.shared"

type ImageDragDropWrapperProps = {
  imageMap: ImageMap,
  onUploaded(uploaded: { fileName: string, path: string }[]): void
  onChange?(value: string): void
  onBusyChange?(busy: boolean): void
  onErrors(errors: string[]): void
  children: ReactNode
  editorRef: RefObject<HTMLTextAreaElement>
}

/** Returns a character offset of a caret placed at viewport point (x, y). */
function offsetFromPoint(x: number, y: number) {
  return document.caretPositionFromPoint(x, y)?.offset
}

/** offset at the end of the editor (fallback drop target). */
function offsetAtEnd(editor: HTMLTextAreaElement) {
  return editor.value.length
}

/** Range for a drop point, fallback to end of editor if input is out of range. */
function dropOffset(editor: HTMLTextAreaElement, x: number, y: number) {
  const offset = offsetFromPoint(x, y)
  const endOffset = offsetAtEnd(editor)
  return offset && offset < endOffset ? offset : endOffset
}

export function ImageDragDropWrapper({ imageMap, onUploaded, onChange, onBusyChange, onErrors, editorRef, children }: ImageDragDropWrapperProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const toBeInsertedPaths = useRef<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasFiles = (e: React.DragEvent<HTMLDivElement>) =>
    Array.from(e.dataTransfer?.types || []).includes("Files")

  const uploadAndInsertFiles = async (files: File[]) => {
    if (files.length === 0) return

    // The picker's accept="image/*" doesn't apply to drops, so check the type here too.
    // The server still checks the actual file contents.
    const toUpload = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_IMAGE_BYTES)
    const newErrors = files.flatMap((f) =>
      !f.type.startsWith("image/") ? [`${f.name} isn't an image`]
        : f.size > MAX_IMAGE_BYTES ? [`${f.name} is larger than the max size of ${MAX_IMAGE_MEGABYTES} MB`]
          : []
    )
    if (toUpload.length === 0) {
      onErrors?.(newErrors)
      return
    }

    setIsUploading(true)
    onBusyChange?.(true)
    try {
      const results = await Promise.allSettled(toUpload.map((file) => postImage(file, "blogs")))

      const uploaded = results.flatMap((result, i) => {
        if (result.status === "fulfilled") return [{ fileName: toUpload[i].name, path: result.value }]
        newErrors.push(`${toUpload[i].name}: ${(result.reason as Error).message}`)
        return []
      })

      if (uploaded.length > 0) {
        onUploaded(uploaded)
        toBeInsertedPaths.current = uploaded.map((upload) => upload.path)
      }
    } finally {
      setIsUploading(false)
      onBusyChange?.(false)
      onErrors(newErrors)
    }

    editorRef.current?.focus()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Keep text/internal image moves behave like default.
    if (!hasFiles(e)) return

    e.preventDefault()
    e.dataTransfer!.dropEffect = "copy"
    setIsDragging(true)

    const editor = editorRef.current!
    const offset = dropOffset(editor, e.clientX, e.clientY)
    editor.setSelectionRange(offset, offset)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget! as Node))
      setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false)
    // Default dropping behavior when not dropping files.
    if (!hasFiles(e)) return

    e.preventDefault()
    uploadAndInsertFiles(Array.from(e.dataTransfer!.files))
  }

  const handlePaste = (e: ClipboardEvent) => {
    const files = Array.from(e.clipboardData?.files || []).filter((f) =>
      f.type.startsWith("image/")
    )

    // Use default pasting behavior when not pasting images.
    if (files.length == 0) return

    e.preventDefault()
    uploadAndInsertFiles(files)
  }

  useEffect(() => {
    editorRef.current?.addEventListener("paste", handlePaste)

    return () => { editorRef.current?.removeEventListener("paste", handlePaste) }
  }, [])

  useEffect(() => {
    if (toBeInsertedPaths.current.length == 0) return
    const keys = Object.keys(imageMap)
    const imageNames = toBeInsertedPaths.current.map(
      (path) => keys.find((key) => imageMap[key] === path)
    )

    const insertText = "\n" + imageNames.map((imageName) => `![](${imageName})`).join("\n") + "\n"
    editorRef.current?.setRangeText(insertText, editorRef.current!.selectionStart, editorRef.current!.selectionEnd, "end")

    onChange?.(editorRef.current?.value ?? "")
  }, [imageMap])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}
