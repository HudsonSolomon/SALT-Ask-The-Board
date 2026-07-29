import { customAlphabet } from "nanoid";

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes are easy to
// read back off a phone screen and re-type accurately.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const generateSuffix = customAlphabet(alphabet, 5);

export const CUSTOM_CODE_MIN_LENGTH = 6;
export const CUSTOM_CODE_MAX_LENGTH = 40;

// Fully random fallback code, used only if a student doesn't set their own.
export function generateClaimCode(): string {
  const generate = customAlphabet(alphabet, 8);
  const raw = generate();
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

// Builds a code from the student's own memorable text plus a short random
// suffix. The suffix is what actually keeps it private: someone who guesses
// or knows the memorable part still can't reconstruct the full code, and
// two students choosing the same word never collide.
export function buildCustomCode(customPart: string): string {
  const suffix = generateSuffix();
  return `${customPart}-${suffix}`;
}

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