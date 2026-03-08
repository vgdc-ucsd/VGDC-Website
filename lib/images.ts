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

export async function uploadImage(image: ImageData) {
  console.error("Upload image not implemented yet");
}
