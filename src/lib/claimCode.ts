import { customAlphabet } from "nanoid";

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes are easy to
// read back off a phone screen and re-type accurately.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const CUSTOM_CODE_MIN_LENGTH = 6;
export const CUSTOM_CODE_MAX_LENGTH = 40;

// Fully random fallback code, used only if a student doesn't set their own.
export function generateClaimCode(): string {
  const generate = customAlphabet(alphabet, 8);
  const raw = generate();
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

// Normalizes a student's custom code so "MyCode", "mycode", and "my code"
// (with different spacing) are treated as the same code when checking for
// duplicates and when looking it up later.
export function normalizeCustomCode(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateCustomCode(input: string): string | null {
  const normalized = normalizeCustomCode(input);
  if (normalized.length < CUSTOM_CODE_MIN_LENGTH) {
    return `Use at least ${CUSTOM_CODE_MIN_LENGTH} characters.`;
  }
  if (normalized.length > CUSTOM_CODE_MAX_LENGTH) {
    return `Keep it under ${CUSTOM_CODE_MAX_LENGTH} characters.`;
  }
  return null;
}