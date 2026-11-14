const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** 4250 -> "$4,250" */
export function formatUSD(value) {
  return usd.format(Math.round(value));
}

/** Round to the nearest step (default $50) so ranges never look falsely precise. */
export function roundTo(value, step = 50) {
  return Math.round(value / step) * step;
}

/** "Harbor & Pine Café" -> "harbor-and-pine-cafe" */
export function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Two-letter initials for avatar fallbacks. */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
