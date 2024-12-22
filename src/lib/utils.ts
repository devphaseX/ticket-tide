import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function snakeCaseToTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
