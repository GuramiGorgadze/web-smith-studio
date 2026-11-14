import { site } from "@/data/site";

/** "/work" -> "https://your-domain.com/work". Falls back to the input when the site URL is not valid. */
export function absoluteUrl(path = "/") {
  try {
    return new URL(path, site.url).toString();
  } catch {
    return path;
  }
}
