import { ImageFolder } from "./images.shared";

/**
 * Public URL of an image in the "Images" bucket, for use in the browser.
 * Built by hand because the Supabase client in lib/supabase.ts reads
 * server-only env vars and can't run on the client.
 */
export function getPublicImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Images/${path}`;
}

/**
  * Uploads an image to storage. Should only be used on the client.
  * Will throw an error if uploading fails.
  * @returns {Promise<string>} The uploaded image's path.
  */
export async function postImage(file: File, folder: ImageFolder): Promise<string> {
  const response = await fetch(`/api/images?folder=${folder}`, { method: "POST", body: file });
  const result = await response.json();

  if (!response.ok) throw new Error(result.error ?? `Failed to upload ${file.name} to ${folder}`);
  
  return result.path;
}
