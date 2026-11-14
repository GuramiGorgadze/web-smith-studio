import { createRouting, normalizeDefaultLocale } from "./locales.js";

/**
 * The language served at the plain addresses (`/work`). Every other language lives under its code (`/ka/work`).
 * Set VITE_DEFAULT_LOCALE=ka in .env to make Georgian the main language and English the `/en` version.
 */
export const routing = createRouting(normalizeDefaultLocale(import.meta.env.VITE_DEFAULT_LOCALE));

export const DEFAULT_LOCALE = routing.defaultLocale;
