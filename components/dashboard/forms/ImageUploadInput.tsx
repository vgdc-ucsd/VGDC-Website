import Image from "next/image"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cx } from "@/components/dashboard/forms/shared"
import { ImageFolder, MAX_IMAGE_BYTES } from "@/lib/images.shared"
import { deleteImages, getPublicImageUrl, postImage } from "@/lib/images.client"
import { BYTES_IN_MEGABYTE } from "@/lib/utils"
import { IoClose } from "react-icons/io5"

/**
* Form input interface for uploading images to storage. When images are successfully uploaded, this component
* will display them.
*/
export function ImageUploadInput({ folder, multiple, paths, onUploaded, onRemoved, onError, onBusyChange }: {
  /** The folder in storage in which the uploaded image should be stored. */
  folder: ImageFolder,
  /** If true, allows multiple images to be uploaded. Otherwise, only a single image can be uploaded. */
  multiple?: boolean,
  /** The paths currently in the form field; shown as thumbnails. */
  paths: string[],
  /** Callback for when the image is successfully uploaded. Returns an array of paths to the images in storage. */
  onUploaded: (paths: string[]) => void,
  /** Callback for when an image is removed. Returns the path of the removed image in storage. */
  onRemoved?: (path: string) => void,
  /** Callback for when uploading throws an error. */
  onError: (message: string) => void,
  /** Callback for when this component starts or stops uploading. */
  onBusyChange?: (busy: boolean) => void
}) {
  const [isUploading, setIsUploading] = useState(false);
  // The native file input is hidden: it can only say "No file chosen", since it's
  // cleared after every selection. The button and thumbnails show the real state.
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!multiple && paths.length === 1) {
      await deleteImages(paths)
    }

    const files = Array.from(e.target.files ?? []);
    // Clear so choosing the same file again (e.g. to retry) still fires onChange
    e.target.value = "";
    if (files.length === 0) return;

    const toUpload = files.filter((f) => f.size <= MAX_IMAGE_BYTES);
    const tooLarge = files.filter((f) => f.size > MAX_IMAGE_BYTES);
    const errors = tooLarge.map((f) => `${f.name} is larger than the max size of ${MAX_IMAGE_BYTES / BYTES_IN_MEGABYTE} MB`);

    if (toUpload.length === 0) {
      onError(errors.join("\n"));
      return;
    }

    setIsUploading(true);
    onBusyChange?.(true);
    try {
      const results = await Promise.allSettled(toUpload.map((file) => postImage(file, folder)));
      const uploaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      results.forEach((result, i) => {
        if (result.status === "rejected") {
          errors.push(`${toUpload[i].name}: ${(result.reason as Error).message}`);
        }
      });

      if (uploaded.length > 0) onUploaded(uploaded);
      if (errors.length > 0) onError(errors.join("\n"));
    } finally {
      setIsUploading(false);
      onBusyChange?.(false);
    }
  }

  const onRemoveButton = (path: string) => {
    deleteImages(path)
    onRemoved?.(path)
  }

  const label = isUploading
    ? "Uploading..."
    : multiple
      ? "Add images"
      : paths.length > 0 ? "Replace image" : "Choose image";

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={isUploading}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()} className={cx.btn}>
          {label}
        </Button>
        <span className={cx.hint}>
          {paths.length === 0 ? "No image uploaded" : `${paths.length} image${paths.length === 1 ? "" : "s"} uploaded`}
        </span>
      </div>
      {paths.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {paths.map((path) => (
            <div key={path} className="relative w-80 h-80">
              <Image
                src={getPublicImageUrl(path)}
                alt=""
                width={320}
                height={320}
                className="h-80 w-80 rounded object-cover"
              />
              { multiple &&
                <Button
                  onClick={() => onRemoveButton(path)}
                  className="absolute right-4 top-4 z-20 px-2 aspect-square rounded-full text-white hover:bg-opacity-90"
                >
                  <IoClose size={20} className="text-white"/>
                </Button>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
