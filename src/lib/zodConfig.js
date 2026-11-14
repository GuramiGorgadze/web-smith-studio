import { z } from "zod";

/**
 * Zod can speed up parsing by compiling a parser with `new Function()`. The site's security policy
 * (server/src/middleware/security.js) forbids that, and the browser would report a policy violation in the
 * console for every visitor even though Zod copes and carries on. The forms here have a handful of fields,
 * so the plain parser is just as fast.
 *
 * This must run before any schema is created, so every file that builds Zod schemas imports it first
 * (it is deliberately not in main.jsx: Zod only loads together with the contact page, not on every page).
 */
z.config({ jitless: true });
