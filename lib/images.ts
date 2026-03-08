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

export async function uploadImage(name: string, file: File) {
  const { data, error } = await supabase.storage.from("Images").upload(name, file)

  if (error) throw error;
  return data;
}
