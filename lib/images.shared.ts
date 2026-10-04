import { BYTES_IN_MEGABYTE } from "./utils";

export const MAX_IMAGE_BYTES = 4 * BYTES_IN_MEGABYTE;

// This is a cool trick I got from https://x.com/mattpocockuk/status/1830546778472546573
export const IMAGE_FOLDERS = ["events", "games", "blogs", "store"] as const;
export type ImageFolder = (typeof IMAGE_FOLDERS)[number];

function hasBytes(bytes: Uint8Array, offset: number, expected: number[]) {
  return expected.every((byte, i) => bytes[offset + i] === byte);
}

function hasText(bytes: Uint8Array, offset: number, text: string) {
  return hasBytes(bytes, offset, Array.from(text, (char) => char.charCodeAt(0)));
}

// Allowed formats, recognized by their first bytes. SVG is deliberately excluded:
// it can contain scripts, and next/image won't optimize it.
export const IMAGE_SIGNATURES: { type: string; matches: (bytes: Uint8Array) => boolean }[] = [
  { type: "image/png",  matches: (b) => hasBytes(b, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { type: "image/jpeg", matches: (b) => hasBytes(b, 0, [0xff, 0xd8, 0xff]) },
  { type: "image/gif",  matches: (b) => hasText(b, 0, "GIF87a") || hasText(b, 0, "GIF89a") },
  { type: "image/webp", matches: (b) => hasText(b, 0, "RIFF") && hasText(b, 8, "WEBP") },
  { type: "image/avif", matches: (b) => hasText(b, 4, "ftyp") && (hasText(b, 8, "avif") || hasText(b, 8, "avis")) },
];

/**
 * Detects an image's format from its magic bytes rather than trusting file.type,
 * which comes from the extension and can be spoofed.
 *
 * @returns The detected MIME type, or null if it isn't an allowed image format.
 */
export async function getImageType(file: Blob): Promise<string | null> {
  // 16 bytes covers the longest signature (WebP/AVIF check up to offset 12)
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return IMAGE_SIGNATURES.find((signature) => signature.matches(header))?.type ?? null;
}

