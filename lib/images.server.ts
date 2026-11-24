import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_IMAGES_BUCKET } from "./r2.server";
import { getRandomElementFromArray } from "./utils";
import { getImageType, MAX_IMAGE_BYTES } from "./images.shared";

export const imageFallbacks = {
  vivi: "/images/officers/placeholders/vivi.png",
  gigi: "/images/officers/placeholders/gigi.png",
  cici: "/images/officers/placeholders/cici.png",
  doug: "/images/officers/placeholders/doug.png",
};

export function getRandomMascotImageFallback(): string {
  return getRandomElementFromArray(Object.values(imageFallbacks))!;
}

/**
 * Since we give each dashboard upload a new UUID, image contents never change
 * so browsers and Cloudflare can cache them without revalidating.
 */
export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable"; // 1 year

/** DeleteObjects accepts at most this many keys per request. */
const MAX_DELETE_KEYS = 1000;

export type UploadImageOptions = {
  /** Defaults to the blob's own type. */
  contentType?: string
  /**
   * Defaults to {@link IMMUTABLE_CACHE_CONTROL}. Pass a shorter one when the
   * same path can be uploaded again with different contents.
   */
  cacheControl?: string
}

/**
 * Uploads an image to the images bucket. Will overwrite anything already at `path`.
 * Throws if the upload fails.
 */
export async function uploadImage(
  path: string,
  image: Blob,
  { contentType = image.type, cacheControl = IMMUTABLE_CACHE_CONTROL }: UploadImageOptions = {},
): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: S3_IMAGES_BUCKET,
    Key: path,
    Body: new Uint8Array(await image.arrayBuffer()),
    ContentType: contentType || undefined,
    CacheControl: cacheControl,
  }));
}

/**
 * Deletes images from the images bucket. Empty paths are ignored and missing
 * images count as deleted. Throws if any image couldn't be deleted.
 */
export async function removeImages(paths: string[]): Promise<void> {
  const keys = paths.filter(Boolean);

  for (let i = 0; i < keys.length; i += MAX_DELETE_KEYS) {
    const batch = keys.slice(i, i + MAX_DELETE_KEYS);
    const response = await s3.send(new DeleteObjectsCommand({
      Bucket: S3_IMAGES_BUCKET,
      Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
    }));

    // With Quiet set, failed keys are reported here instead of throwing
    if (response.Errors?.length) {
      const failed = response.Errors.map((e) => `${e.Key} (${e.Code ?? "unknown error"})`);
      throw new Error(`Failed to delete ${failed.length} image(s): ${failed.slice(0, 10).join(", ")}`);
    }
  }
}

/**
 * Validates image files from a form submission. The browser-supplied file.type
 * comes from the file extension and can be set to anything by a direct request,
 * so the format is detected from the file contents instead.
 *
 * @returns The files, typed with their detected format, or an error message.
 */
export async function validateFormImageFiles(values: FormDataEntryValue[]): Promise<File[] | string> {
  // An empty file input still submits a 0-byte File, so treat that as "no file"
  const files = values.filter((v): v is File => v instanceof File && v.size > 0);

  const validated: File[] = [];
  for (const file of files) {
    if (file.size > MAX_IMAGE_BYTES) {
      return `${file.name} is larger than ${MAX_IMAGE_BYTES / 1024 / 1024} MB`;
    }

    const type = await getImageType(file);
    if (!type) return `${file.name} must be a PNG, JPEG, WebP, GIF or AVIF image`;

    // Re-type the file so it's stored with its real content type, not the claimed one
    validated.push(file.type === type ? file : new File([file], file.name, { type }));
  }
  return validated;
}
