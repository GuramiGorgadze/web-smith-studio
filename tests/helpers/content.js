// Shared by the tests: loads the composed content of a language the same way the site does, but in Node.
// (src/content/<code>/index.js cannot be imported here because it uses the "@" alias, so the modules of the
// folder are imported one by one and put together with the same composeContent() function.)

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { composeContent } from "../../src/content/compose.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "../..");
export const CONTENT_DIR = path.join(ROOT, "src/content");

/**
 * What src/data/site.js gives the site in the browser. That file reads import.meta.env, which Node does not
 * have, so the tests use their own copy of the language-free facts.
 */
export const facts = Object.freeze({
  name: "Web Smith Studio",
  shortName: "Web Smith",
  url: "https://example.test",
  email: "hello@example.test",
  founded: 2026,
  socials: [{ label: "GitHub", href: "https://github.com" }],
});

/**
 * Every language that has a content folder, published or not: ["en", "ka"]. The tests check all of them, so a
 * language that is switched off in src/i18n/locales.js (Georgian, for now) stays complete and ready to switch on.
 */
export const CONTENT_LOCALES = Object.freeze(
  readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b))),
);

/** The content files of a language folder, without index.js: ["about", "contact", ...]. */
export function moduleNames(locale) {
  return readdirSync(path.join(CONTENT_DIR, locale))
    .filter((file) => file.endsWith(".js") && file !== "index.js")
    .map((file) => file.slice(0, -3))
    .sort();
}

const cache = new Map();

/** The same object useContent() returns in the browser for this language. */
export function loadLocale(locale) {
  if (!cache.has(locale)) {
    cache.set(
      locale,
      (async () => {
        const modules = {};
        for (const name of moduleNames(locale)) {
          modules[name] = await import(`../../src/content/${locale}/${name}.js`);
        }
        return composeContent(locale, modules, facts);
      })(),
    );
  }
  return cache.get(locale);
}

/** What kind of value this is: "string", "number", "boolean", "null", "array" or "object". */
export function kindOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** "navigation.primary[0].label": the address of a value inside the content, for failure messages. */
export function pathToString(parts) {
  return parts.reduce((text, part) => (typeof part === "number" ? `${text}[${part}]` : text ? `${text}.${part}` : part), "");
}

/** Every value that is not an object or array, with its address as an array of keys and indexes. */
export function* leaves(value, parts = []) {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) yield* leaves(value[index], [...parts, index]);
  } else if (value !== null && typeof value === "object") {
    for (const key of Object.keys(value)) yield* leaves(value[key], [...parts, key]);
  } else {
    yield { parts, value };
  }
}

/** Reads the value at an address of array keys and indexes. */
export function getAt(root, parts) {
  return parts.reduce((node, part) => (node == null ? undefined : node[part]), root);
}

/**
 * Georgian letters: the ranges are U+10A0 to U+10FF (Asomtavruli and Mkhedruli), U+1C90 to U+1CBF (Mtavruli)
 * and U+2D00 to U+2D2F (Nuskhuri).
 */
export const GEORGIAN = /[Ⴀ-ჿᲐ-Ჿⴀ-⴯]/u;
