/** Small helpers that keep exactly one of each tag in <head> while the visitor moves between pages. */

export function upsertMeta(attr, key, content) {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]:not([hreflang])`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/** Replaces the page's hreflang links. `list` is [{ hreflang: "en", href: "https://..." }]; empty removes them. */
export function setAlternates(list) {
  document.head.querySelectorAll('link[rel="alternate"][data-seo="hreflang"]').forEach((element) => element.remove());

  for (const { hreflang, href } of list) {
    const element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", hreflang);
    element.setAttribute("href", href);
    element.setAttribute("data-seo", "hreflang");
    document.head.appendChild(element);
  }
}

/** Replaces the extra og:locale:alternate tags. */
export function setOgAlternates(locales) {
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((element) => element.remove());

  for (const locale of locales) {
    const element = document.createElement("meta");
    element.setAttribute("property", "og:locale:alternate");
    element.setAttribute("content", locale);
    document.head.appendChild(element);
  }
}

/** Adds, updates or (with an empty string) removes the page's JSON-LD block. */
export function setJsonLd(text) {
  let element = document.head.querySelector('script[data-seo="json-ld"]');

  if (!text) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("script");
    element.setAttribute("type", "application/ld+json");
    element.setAttribute("data-seo", "json-ld");
    document.head.appendChild(element);
  }
  element.textContent = text;
}
