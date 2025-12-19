import { supabase } from "./supabase";
import { getRandomElementFromArray } from "./utils";

export async function GetStoredImageUrl(path: string) {
  return supabase.storage.from("Images").getPublicUrl(path).data.publicUrl;
}

export const imageFallbacks = {
  vivi: "/images/officers/placeholders/vivi.png",
  gigi: "/images/officers/placeholders/gigi.png",
  cici: "/images/officers/placeholders/doug.png",
  doug: "/images/officers/placeholders/cici.png",
};

export function GetRandomMascotImageFallback(): string {
  return getRandomElementFromArray(Object.values(imageFallbacks));
}

export async function UploadImage(image: ImageData) {
  console.error("Upload image not implemented yet");
}
