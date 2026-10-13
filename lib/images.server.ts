import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { getRandomElementFromArray } from "./utils";
import { getImageType, MAX_IMAGE_BYTES } from "./images.shared";

export async function getStoredImageUrl(path: string) {
  return supabase.storage.from("Images").getPublicUrl(path).data.publicUrl;
}

export const imageFallbacks = {
  vivi: "/images/officers/placeholders/vivi.png",
  gigi: "/images/officers/placeholders/gigi.png",
  cici: "/images/officers/placeholders/cici.png",
  doug: "/images/officers/placeholders/doug.png",
};

export function getRandomMascotImageFallback(): string {
  return getRandomElementFromArray(Object.values(imageFallbacks))!;
}

export type UploadImageOptions = {
  /** Defaults to the anon client; server-side scripts can pass a service-role client. */
  client?: SupabaseClient
  /** Overwrite an existing file at the same path instead of failing. */
  upsert?: boolean
}

export async function uploadImage(path: string, file: File, { client = supabase, upsert = false }: UploadImageOptions = {}) {
  const { data, error } = await client.storage.from("Images").upload(path, file, { upsert })

  if (error) throw error;
  return data;
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
