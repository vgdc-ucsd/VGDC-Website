import { ImageFolder } from "./images.shared";

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

/**
  * Deletes images from storage. Should only be used on the client.
  * Will throw an error if deleting fails.
  */
export async function deleteImages(paths: string | string[]): Promise<undefined> {
  if (paths.length == 0) { throw new Error("paths should not be empty") }

  const response = await fetch(
    `/api/images`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: paths })
    }
  )

  const result = await response.json()
  const pathArray = typeof paths === "string" ? [paths] : paths

  if (!response.ok) throw new Error(
    result.error ?? `Failed to delete ${ pathArray.length == 1 ? pathArray[0] : pathArray.slice(0, 10).join(", ") }`
  )
}
