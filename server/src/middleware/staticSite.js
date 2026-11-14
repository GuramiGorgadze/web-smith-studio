import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import express from "express";

/**
 * Finds the inline scripts in the page and returns their Content-Security-Policy hashes
 * ('sha256-...'). Data blocks such as JSON-LD are not executed, so they need none.
 *
 * @param {string} markup
 */
export function inlineScriptHashes(markup) {
  const hashes = [];

  for (const match of markup.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1];
    const body = match[2];
    if (/\bsrc\s*=/i.test(attributes) || body.trim() === "") continue;

    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attributes)?.[1]?.toLowerCase();
    const executable = !type || type === "module" || type === "text/javascript" || type === "application/javascript";
    if (!executable) continue;

    hashes.push(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }

  return hashes;
}

/**
 * Serves the built website (the dist/ folder) so one Node process can host the pages and the API together.
 * Hashed files under /assets are cached for a year, the page shell is never cached, and every page address
 * that is not a file gets the app shell so client-side routing works on a direct visit or a refresh.
 *
 * @param {{ dir: string }} options
 */
export function createStaticSite({ dir }) {
  const indexPath = path.join(dir, "index.html");
  const scriptHashes = inlineScriptHashes(readFileSync(indexPath, "utf8"));
  const router = express.Router();

  router.use(
    express.static(dir, {
      index: false,
      redirect: false,
      dotfiles: "ignore",
      setHeaders(response, filePath) {
        const [firstFolder] = path.relative(dir, filePath).split(path.sep);
        if (firstFolder === "assets") response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        else if (path.basename(filePath) === "index.html") response.setHeader("Cache-Control", "no-cache");
        else response.setHeader("Cache-Control", "public, max-age=3600");
      },
    }),
  );

  router.use((request, response, next) => {
    const isRead = request.method === "GET" || request.method === "HEAD";
    // A path with an extension is a file request. If it was not found above, it is a real 404, not a page.
    if (!isRead || path.extname(request.path) !== "") {
      next();
      return;
    }
    response.set("Cache-Control", "no-cache");
    response.sendFile(indexPath, { cacheControl: false }, (error) => {
      if (error) next(error);
    });
  });

  return { router, scriptHashes };
}
