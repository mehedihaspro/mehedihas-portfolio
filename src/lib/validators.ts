/**
 * Shared validation utilities.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

/** Strip control characters and trim. */
export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}
