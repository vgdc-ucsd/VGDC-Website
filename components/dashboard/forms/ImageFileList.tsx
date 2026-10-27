import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cleanImageName, ImageMap } from "@/lib/blog_images.shared";
import { postImage } from "@/lib/images.client";
import { MAX_IMAGE_BYTES, MAX_IMAGE_MEGABYTES } from "@/lib/images.shared";
import { Copy, FilePlus, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { useRef, useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";

type ImageFileListProps = {
  imageMap: ImageMap,
  onUploaded: (uploaded: { fileName: string, path: string }[]) => void,
  onBusyChange?: (busy: boolean) => void,
  onInsert?: (name: string) => void,
  /** Callback for when the user renames an image. `newName` is already cleaned and not taken. */
  onRename: (oldName: string, newName: string) => void,
  /** Callback for when the user removes an image from the post. */
  onDelete: (name: string) => void,
  errors: string[],
  onErrors: (errors: string[]) => void,
};

export default function ImageFileList({ imageMap, onUploaded, onBusyChange, onInsert, onRename, onDelete, errors, onErrors}: ImageFileListProps) {
  const [isUploading, setIsUploading] = useState(false);
  // The name of the image being renamed, and what's typed so far
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // Clear so choosing the same file again (e.g. to retry) still fires onChange
    e.target.value = "";
    await uploadFiles(files);
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    // The picker's accept="image/*" doesn't apply to drops, so check the type here too.
    // The server still checks the actual file contents.
    const toUpload = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_IMAGE_BYTES);
    const newErrors = files.flatMap((f) =>
      !f.type.startsWith("image/") ? [`${f.name} isn't an image`]
      : f.size > MAX_IMAGE_BYTES ? [`${f.name} is larger than the max size of ${MAX_IMAGE_MEGABYTES} MB`]
      : []
    );
    if (toUpload.length === 0) {
      onErrors(newErrors);
      return;
    }

    setIsUploading(true);
    onBusyChange?.(true);
    try {
      const results = await Promise.allSettled(toUpload.map((file) => postImage(file, "blogs")));

      const uploaded = results.flatMap((result, i) => {
        if (result.status === "fulfilled") return [{ fileName: toUpload[i].name, path: result.value }];
        newErrors.push(`${toUpload[i].name}: ${(result.reason as Error).message}`);
        return []
      });
      if (uploaded.length > 0) onUploaded(uploaded);
    } finally {
      setIsUploading(false);
      onBusyChange?.(false);
      onErrors(newErrors);
    }
  }

  // Only react to files from the computer, not dragged text or links
  const isFileDrag = (e: React.DragEvent) => e.dataTransfer.types.includes("Files");

  function handleDragOver(e: React.DragEvent) {
    if (!isFileDrag(e)) return;
    // Without preventDefault the browser won't allow a drop here, and opens the file instead
    e.preventDefault();
    e.dataTransfer.dropEffect = isUploading ? "none" : "copy";
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    // dragleave also fires when moving onto the zone's own text; ignore that
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    uploadFiles(Array.from(e.dataTransfer.files));
  }

  function insert(name: string) {
    if (onInsert) onInsert(name);
    else copyMarkdown(name);
  }

  function copyMarkdown(name: string) {
    navigator.clipboard.writeText(`![](${name})`);
  }

  function startRename(name: string) {
    setRenaming(name);
    setDraftName(name);
    onErrors([]);
  }

  /** @param keepEditingOnError Leave the input open on a bad name (Enter) rather than giving up (blur). */
  function commitRename(keepEditingOnError: boolean) {
    if (renaming === null) return;
    const newName = cleanImageName(draftName);

    if (newName !== renaming) {
      const error = !newName ? "Image names can't be empty"
        : newName in imageMap ? `An image named ${newName} already exists`
        : null;
      if (error) {
        onErrors([error]);
        if (keepEditingOnError) return;
      } else {
        onRename(renaming, newName);
      }
    }
    setRenaming(null);
  }

  const imageMapEntries = Object.entries(imageMap);

  return (
    <div className="flex flex-col w-full bg-background-grey rounded-lg">
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleChange} />

      <div className="flex justify-between items-center w-full rounded-t-lg p-2">
        <h4 className="text-white text-lg ml-2"><strong>Images</strong></h4>
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="hover:bg-gray-900"
        >
          <FilePlus className="stroke-white" />
        </Button>
      </div>
      <div className="p-2 w-full h-full">
        <ul className="bg-black p-2 space-y-2">
          {imageMapEntries.map(([name, path]) => (
            <li key={`${path}`} className="bg-background-grey h-12 rounded-md flex flex-row items-center justify-between gap-1 p-2">
              {renaming === name ? (
                <input
                  ref={renameInputRef}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter would otherwise submit the blog post form
                    if (e.key === "Enter") { e.preventDefault(); commitRename(true); }
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  onBlur={() => commitRename(false)}
                  aria-label={`New name for ${name}`}
                  className="min-w-0 flex-1 rounded bg-black px-2 py-1 text-sm text-white outline-none ring-1 ring-gray-700 focus:ring-vgdc-light-green"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => insert(name)}
                  title={`${name}\n${onInsert ? "Insert into post" : "Click to copy Markdown"}`}
                  className="flex flex-1 flex-row items-center space-x-1 min-w-0 text-left"
                >
                  <ImageIcon className="stroke-[#bebebe] shrink-0"/>
                  <strong className="text-text-grey truncate">{name}</strong>
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Options for ${name}`} className="h-fit w-fit shrink-0 hover:bg-transparent">
                    <IoEllipsisVertical className="text-text-grey hover:text-text-white size-5"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-gray-700 bg-background-grey text-text-grey"
                  // Radix gives focus back to the ⋮ button on close, which would blur and end the rename right away
                  onCloseAutoFocus={(e) => {
                    if (renaming === null) return;
                    e.preventDefault();
                    renameInputRef.current?.focus();
                    renameInputRef.current?.select();
                  }}
                >
                  <DropdownMenuItem onSelect={() => copyMarkdown(name)} className="focus:bg-gray-900 focus:text-white">
                    <Copy /> Copy Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => startRename(name)} className="focus:bg-gray-900 focus:text-white">
                    <Pencil /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onDelete(name)} className="text-red-400 focus:bg-gray-900 focus:text-red-400">
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
          {/* Drop zone below the last image; grows while a file is dragged over it */}
          <li
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex items-center justify-center rounded-md border-2 border-dashed px-2 text-center text-sm transition-all duration-150 ${
              isDragOver
                ? "h-24 border-vgdc-light-green bg-vgdc-light-green/10 text-white"
                : "h-12 border-gray-700 text-text-grey"
            }`}
          >
            {isUploading ? "Uploading..."
              : isDragOver ? "Drop to upload"
              : imageMapEntries.length === 0 ? "No images yet. Drag images here"
              : "Drag images here"}
          </li>
        </ul>
        {errors.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-red-400">
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
