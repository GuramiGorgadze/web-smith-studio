import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { setAlternates, setJsonLd, setOgAlternates, upsertLink, upsertMeta } from "@/lib/head";
import { absoluteUrl } from "@/lib/url";

/**
 * Per-route document head: title, description, canonical, language alternates, social tags and optional JSON-LD.
 * Updates the existing tags in place so there is only ever one of each.
 *
 * `path` is the page's address without a language ("/work"); the component adds the current language for
 * the canonical link and lists every language version as hreflang alternates.
 * `jsonLd` takes one schema.org object or an array of them.
 */
export function Seo({ title, description, path = "/", image, noindex = false, jsonLd }) {
  const { locale, meta, languages, site, path: localize, pathIn, defaultLocale } = useI18n();
  const resolvedDescription = description ?? site.description;
  const resolvedImage = image ?? site.ogImage;
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";
  const pageUrl = absoluteUrl(localize(path));

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name}: ${site.tagline}`;
    document.title = fullTitle;

    upsertMeta("name", "description", resolvedDescription);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", resolvedDescription);
    upsertMeta("property", "og:url", pageUrl);
    upsertMeta("property", "og:image", absoluteUrl(resolvedImage));
    upsertMeta("property", "og:locale", meta.ogLocale);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", resolvedDescription);
    upsertMeta("name", "twitter:image", absoluteUrl(resolvedImage));
    upsertLink("canonical", pageUrl);

    // Language versions of this page. A page that is not indexed has no business advertising versions.
    if (noindex) {
      setAlternates([]);
      setOgAlternates([]);
    } else {
      setAlternates([
        ...languages.map((language) => ({ hreflang: language.code, href: absoluteUrl(pathIn(path, language.code)) })),
        { hreflang: "x-default", href: absoluteUrl(pathIn(path, defaultLocale)) },
      ]);
      setOgAlternates(languages.filter((language) => language.code !== locale).map((language) => language.ogLocale));
    }
  }, [
    title,
    resolvedDescription,
    resolvedImage,
    path,
    pageUrl,
    noindex,
    locale,
    meta.ogLocale,
    languages,
    pathIn,
    defaultLocale,
    site.name,
    site.tagline,
  ]);

  useEffect(() => {
    setJsonLd(jsonLdText);
    return () => setJsonLd("");
  }, [jsonLdText]);

  return null;
}
