import { z } from "zod";

const emailCheck = z.email();

const NAMED_MAILBOX = /^\s*"?([^"<>]*?)"?\s*<([^<>\s]+)>\s*$/;
const BARE_MAILBOX = /^\s*([^<>\s]+)\s*$/;

/**
 * Reads `Name <me@example.com>` or a bare `me@example.com`.
 * Returns `{ name?, address }`, or null when the address is not valid.
 */
export function parseMailbox(value) {
  const text = String(value ?? "");
  const named = NAMED_MAILBOX.exec(text);
  const rawName = named ? named[1] : "";
  const address = named ? named[2] : (BARE_MAILBOX.exec(text)?.[1] ?? "");

  if (!emailCheck.safeParse(address).success) return null;

  const name = rawName.replace(/[\r\n]+/g, " ").trim();
  return name ? { name, address } : { address };
}
