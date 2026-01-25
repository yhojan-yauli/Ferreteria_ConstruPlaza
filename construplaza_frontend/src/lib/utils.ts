/**
 * Utility function to combine class names
 * Simple replacement for clsx + tailwind-merge
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter((input): input is string => typeof input === "string" && input.length > 0)
    .join(" ");
}
