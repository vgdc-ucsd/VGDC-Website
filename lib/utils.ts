import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export type Result<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string }

// Since VGDC is based in San Diego, we can assume Pacific time
export const Timezone = "America/Los_Angeles";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomElementFromArray<T>(arr: Array<T | null>) {
  if (!arr || arr.length === 0) return null;

  const randIdx = Math.floor(Math.random() * arr.length);
  return arr[randIdx];
}

export const BYTES_IN_MEGABYTE = 1024 * 1024;
