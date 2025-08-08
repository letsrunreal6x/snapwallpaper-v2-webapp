import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique ID for a wallpaper by combining its original ID and the query.
 * This prevents ID collisions when the same image appears in different search results.
 * @param originalId The original ID from the image service (e.g., 'pexels-12345').
 * @param query The search query used to find the image (e.g., 'nature').
 * @returns A new, globally unique ID (e.g., 'pexels-12345_query_nature').
 */
export function generateUniqueWallpaperId(originalId: string, query: string): string {
  const sanitizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${originalId}_query_${sanitizedQuery}`;
}
