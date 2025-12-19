import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomElementFromArray(arr: Array<any>) {
  if (!arr || arr.length === 0) return null;

  const randIdx = Math.floor(Math.random() * arr.length);
  return arr[randIdx];
}
