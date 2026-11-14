// Helpers that make visitor-supplied text safe to show, log and place in email headers.

/** A string made of every character from `first` to `last` (inclusive), by character code. */
const span = (first, last = first) => Array.from({ length: last - first + 1 }, (_, index) => String.fromCharCode(first + index)).join("");

// Characters that can hide or reorder text: zero-width space, direction marks, bidi embeddings, overrides and
// isolates, the word joiner and the byte-order mark. (Built from character codes so the source stays plain ASCII.)
const INVISIBLE = new RegExp(`[${span(0x200b)}${span(0x200e, 0x200f)}${span(0x202a, 0x202e)}${span(0x2060)}${span(0x2066, 0x2069)}${span(0xfeff)}]`, "g");

// Control characters. The first pattern keeps tab (9) and line feed (10); the second removes every one.
const CONTROL_KEEP_BREAKS = new RegExp(`[${span(0, 8)}${span(11, 12)}${span(14, 31)}${span(127, 159)}]`, "g");
const CONTROL_ALL = new RegExp(`[${span(0, 31)}${span(127, 159)}]`, "g");

// Line and paragraph separators, which JavaScript treats as line breaks.
const UNICODE_BREAKS = new RegExp(`[${span(0x2028, 0x2029)}]`, "g");

// A first name we are happy to echo back in a confirmation email: letters, marks, apostrophes and hyphens only.
// No digits, dots, slashes or colons, so a link or an address can never ride along inside a "name".
const PLAIN_NAME = /^[\p{L}\p{M}'’-]{1,40}$/u;

/** One line of text: no line breaks, no control or invisible characters, single spaces. Safe for headers and subjects. */
export function singleLine(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(CONTROL_ALL, " ")
    .replace(UNICODE_BREAKS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Free text such as a message: keeps paragraphs and line breaks, drops control and invisible characters. */
export function multiLine(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(UNICODE_BREAKS, "\n")
    .replace(INVISIBLE, "")
    .replace(CONTROL_KEEP_BREAKS, "")
    .replace(/[^\S\n]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** The first word of a name, but only when it looks like a plain name. Otherwise an empty string. */
export function safeFirstName(name) {
  const first = singleLine(name).split(" ")[0] ?? "";
  return PLAIN_NAME.test(first) ? first : "";
}

/**
 * A visitor's name for the display part of an email address. Angle brackets, quotes, at signs and backslashes
 * are removed, so a name can never look like a second address ("Boss <ceo@bank.com>") in the inbox list.
 */
export function displayName(value) {
  return singleLine(String(value ?? "").replace(/[<>"@\\]/g, " "));
}

/** "ana@example.com" becomes "a***@example.com", so logs never hold full addresses. */
export function maskEmail(email) {
  const [local = "", domain = ""] = String(email ?? "").split("@");
  if (!domain) return "***";
  return `${local.slice(0, 1)}***@${domain}`;
}

/** Masks every email address inside a piece of text, such as an SMTP error message that repeats the recipient. */
export function maskEmailsIn(text) {
  return String(text ?? "").replace(/[^\s<>"'(),;:]+@[^\s<>"'(),;:]+/g, (address) => maskEmail(address));
}

/** Shortens text to `max` characters and adds an ellipsis when something was cut. */
export function truncate(value, max) {
  const characters = Array.from(String(value ?? ""));
  return characters.length <= max ? characters.join("") : `${characters.slice(0, max - 1).join("").trimEnd()}…`;
}
