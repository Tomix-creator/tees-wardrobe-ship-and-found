/**
 * lib/validation.ts
 *
 * Pure validation functions for Tee's Wardrobe account forms.
 * Every function returns null (valid) or the exact error message string.
 * No side effects. No imports.
 */

// =============================================================================
// Cleaners
// Exported so the submit handler can send cleaned values to the server.
// =============================================================================

/** Trim outer whitespace and collapse any run of inner spaces to one space. */
export function cleanFullName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Trim leading/trailing whitespace from an email address. */
export function cleanEmail(raw: string): string {
  return raw.trim();
}

/**
 * Remove spaces, dashes, and parentheses from a phone number.
 * Used both during validation and before sending to the server.
 */
export function cleanPhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "");
}

// =============================================================================
// Rule 1 — Required fields
// =============================================================================

/** Returns an error if the full-name field is blank after trimming. */
export function requiredFullName(raw: string): string | null {
  return raw.trim() === ""
    ? "Tee needs your first name and surname."
    : null;
}

/** Returns an error if the email field is blank after trimming. */
export function requiredEmail(raw: string): string | null {
  return raw.trim() === ""
    ? "Enter the email you\u2019ll log in with."
    : null;
}

/** Returns an error if the phone field is blank after trimming. */
export function requiredPhone(raw: string): string | null {
  return raw.trim() === ""
    ? "Enter a number Tee can reach you on."
    : null;
}

/**
 * Returns an error if the password field is exactly empty.
 * A string containing only spaces is NOT caught here — passwordRules handles it.
 */
export function requiredPassword(raw: string): string | null {
  return raw === "" ? "Choose a password." : null;
}

// =============================================================================
// Rule 2 — Full name format (sign-up only)
// =============================================================================

const NAME_ERROR =
  "Please enter at least your first name and surname, using letters only.";

/**
 * Validates the format of a full name.
 * Assumes requiredFullName has already passed (value is non-empty).
 *
 * Rules applied in order:
 *  1. Clean (trim + collapse spaces).
 *  2. Max 80 characters.
 *  3. At least two space-separated words.
 *  4. Every word must start with a Unicode letter (\p{L}).
 *  5. Only Unicode letters, spaces, hyphens, and apostrophes (' and \u2019) allowed.
 */
export function fullNameFormat(raw: string): string | null {
  const cleaned = cleanFullName(raw);

  if (cleaned.length > 80) return NAME_ERROR;

  const words = cleaned.split(" ");
  if (words.length < 2) return NAME_ERROR;

  // Each word must start with a Unicode letter.
  const startsWithLetter = /^\p{L}/u;
  for (const word of words) {
    if (!startsWithLetter.test(word)) return NAME_ERROR;
  }

  // Only allowed characters: Unicode letters, spaces, hyphens, apostrophes.
  const allowedOnly = /^[\p{L}\p{M}\s\-'\u2019]+$/u;
  if (!allowedOnly.test(cleaned)) return NAME_ERROR;

  return null;
}

// =============================================================================
// Rule 3 — Phone format (sign-up only)
// =============================================================================

/**
 * Validates a phone number after cleaning (removing spaces, dashes, brackets).
 * Accepts:
 *   ^0\d{10}$              — Nigerian local (e.g. 08031234567)
 *   ^\+234\d{10}$          — Nigerian international (e.g. +2348031234567)
 *   ^\+[1-9]\d{7,14}$      — Other international, when NOT starting with +234
 */
export function phoneFormat(raw: string): string | null {
  const cleaned = cleanPhone(raw);

  if (/^0\d{10}$/.test(cleaned)) return null;
  if (/^\+234\d{10}$/.test(cleaned)) return null;
  if (!cleaned.startsWith("+234") && /^\+[1-9]\d{7,14}$/.test(cleaned)) return null;

  return "Use a Nigerian number like 0803 123 4567, or an overseas number starting with +.";
}

// =============================================================================
// Rule 4 — Password rules (sign-up only)
// =============================================================================

/**
 * Validates password content and length.
 * The password is NEVER trimmed.
 * Returns null if raw is empty (requiredPassword handles the empty case).
 *
 * Check order:
 *  1. All-whitespace  → "A password can't be only spaces."
 *  2. Too short       → "Use at least 8 characters."
 *  3. Too long        → "Use 64 characters or fewer."
 */
export function passwordRules(raw: string): string | null {
  if (raw.length === 0) return null; // handled by requiredPassword

  if (raw.trim() === "") return "A password can\u2019t be only spaces.";
  if (raw.length < 8) return "Use at least 8 characters.";
  if (raw.length > 64) return "Use 64 characters or fewer.";

  return null;
}

// =============================================================================
// Rule 5 — Email format (all three forms)
// =============================================================================

/**
 * Validates the shape of an email address after trimming.
 * Assumes requiredEmail has already passed (value is non-empty).
 *
 * Rules:
 *  1. Trimmed length must not exceed 254 characters.
 *  2. Must match ^[^\s@]+@[^\s@]+\.[^\s@]+$
 */
export function emailFormat(raw: string): string | null {
  const trimmed = cleanEmail(raw);
  const ERROR =
    "That doesn\u2019t look like an email address. Check for a missing @ or dot.";

  if (trimmed.length > 254) return ERROR;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return ERROR;

  return null;
}

// =============================================================================
// Rule 6 — Checkboxes (sign-up only, checked on submit)
// =============================================================================

/** Returns an error if the Terms checkbox is not ticked. */
export function requiredTerms(checked: boolean): string | null {
  return checked
    ? null
    : "Please agree to the Terms and Privacy Notice to continue.";
}

/** Returns an error if the age checkbox is not ticked. */
export function requiredAdult(checked: boolean): string | null {
  return checked ? null : "You need to be 18 or older to create an account.";
}

