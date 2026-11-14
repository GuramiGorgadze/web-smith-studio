import path from "node:path";
import { assetsDir } from "../lib/paths.js";

// Images the emails embed. They travel inside the message (Content-ID), so they show even when the
// reader's mail app blocks remote images, and they do not depend on the website being online.

export const logo = {
  cid: "wss-logo",
  file: path.join(assetsDir, "logo-mark.png"),
  filename: "web-smith-studio-logo.png",
  width: 27,
  height: 40,
};

export const check = {
  cid: "wss-check",
  file: path.join(assetsDir, "check.png"),
  filename: "check.png",
  width: 48,
  height: 48,
};

/** Nodemailer attachment objects for inline images. */
export function inlineImages(...images) {
  return images.map((image) => ({
    filename: image.filename,
    path: image.file,
    cid: image.cid,
    contentDisposition: "inline",
  }));
}

/**
 * Swaps `cid:` image sources for relative file paths so a saved HTML preview opens correctly in a browser.
 * @param {string} markup
 * @param {string} fromDir  The folder the HTML file will be saved in.
 */
export function cidToFilePaths(markup, fromDir) {
  let result = markup;
  for (const image of [logo, check]) {
    const relative = path.relative(fromDir, image.file).split(path.sep).join("/");
    result = result.replaceAll(`cid:${image.cid}`, relative);
  }
  return result;
}
