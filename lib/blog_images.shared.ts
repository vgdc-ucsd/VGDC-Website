import { getPublicImageUrl } from "./images.client";

// [\s\S] instead of . with the s flag, which the tsconfig target doesn't support
const IMAGE_MAP_COMMENT = /\n*<!-- vgdc-images (\{[\s\S]*?\}) -->\s*$/;

/** Map from a local image name as written in the Markdown to the actual stored image path in the database */
export type ImageMap = Record<string, string>;

/** 
* Resolves an image src into a real URL if it's a local name. Otherwise, leaves it alone
* @param src The image's src
* @param imageMap The `ImageMap` to use as the resolver
* @returns A real URL regardless of whether it's a local name or an actual URL;
*/
export function resolveImageSrc(src: string, imageMap: ImageMap): string {
  const path = imageMap[decodeURIComponent(src)];
  return path ? getPublicImageUrl(path) : src;
}

/**
* Makes a name safe to use as a Markdown image src, since `![](my pic.png)` isn't a valid image.
* @param name The filename or user-entered name to clean
*/
export function cleanImageName(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

/**
* Generates a Markdown-safe name from a filename that is unique among the given ImageMap.
* @param fileName The filename from which to generate the image name
* @param imageMap The `ImageMap` containing existing names
*/
export function generateUniqueImageName(fileName: string, imageMap: ImageMap): string {
  const clean = cleanImageName(fileName);
  if (!(clean in imageMap)) return clean;

  const dotIndex = clean.lastIndexOf(".");
  const [base, extension] = dotIndex > 0
    ? [clean.slice(0, dotIndex), clean.slice(dotIndex)]
    : [clean, ""];

  // Increment the index until we can find an untaken name
  let n = 1;
  while (`${base}-${n}${extension}` in imageMap) n++;

  return `${base}-${n}${extension}`;
}

/**
* Splits stored blog post data into the written Markdown and its `ImageMap`. 
* Assumes that the `ImageMap` is stored as a comment at the end of the blog post.
*/
export function splitPostData(postData: string): { content: string; imageMap: ImageMap } {
  const match = postData.match(IMAGE_MAP_COMMENT);
  if (!match) return { content: postData, imageMap: {} };

  try {
    return { content: postData.slice(0, match.index), imageMap: JSON.parse(match[1]) };
  } catch {
    return { content: postData, imageMap: {} };
  }
}

/**
* Appends the `ImageMap` as a comment to to the end of the Markdown for storage.
*/
export function joinPostData(content: string, imageMap: ImageMap): string {
  if (Object.keys(imageMap).length === 0) return content;

  const json = JSON.stringify(imageMap);
  // If "--" is in a name or path, it would end the comment early, which would break the post.
  // We escape all instances of "--" with their unicode literals to avoid this.
  const sanitized = json.replace(/--/g, "\\u002d\\u002d");

  return `${content}\n\n<!-- vgdc-images ${sanitized} -->`;
}
