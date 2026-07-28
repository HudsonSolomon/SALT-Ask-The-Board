import { customAlphabet } from "nanoid";

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes are easy to
// read back off a phone screen and re-type accurately.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const generate = customAlphabet(alphabet, 8);

export function generateClaimCode(): string {
  const raw = generate();
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}
