import path from "node:path";
import { fileURLToPath } from "node:url";

/** The server/ folder, wherever the project is installed. */
export const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Pre-rendered PNGs the emails embed (logo mark, check badge). */
export const assetsDir = path.join(serverRoot, "assets");
