import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { getRandomElementFromArray } from "./utils";

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

export async function uploadImage(name: string, file: File, { client = supabase, upsert = false }: UploadImageOptions = {}) {
  const { data, error } = await client.storage.from("Images").upload(name, file, { upsert })

  if (error) throw error;
  return data;
}
