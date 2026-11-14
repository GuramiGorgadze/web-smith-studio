import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { projects } from "./src/content/en/projects.js";
import { createRouting, LOCALES, normalizeDefaultLocale } from "./src/i18n/locales.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Every page that should appear in the sitemap, written without a language. Keep in step with `pages()` in
// src/routes/router.jsx. The sitemap lists each page once per language (see src/i18n/locales.js).
// "/pricing" is switched off for now, like its route.
const pageRoutes = ["/", "/services", "/work", /* "/pricing", */ "/about", "/contact", "/privacy", "/terms"];
const priorityFor = (route) => (route === "/" ? "1.0" : route === "/privacy" || route === "/terms" ? "0.3" : "0.8");

/**
 * Fills in the parts of the HTML that cannot read environment variables at runtime, and writes
 * sitemap.xml and robots.txt, all from VITE_SITE_URL, VITE_CONTACT_EMAIL and VITE_DEFAULT_LOCALE.
 * Without a .env file the placeholder domain from src/data/site.js and English as default language are used.
 */
function seoFiles(env) {
  const siteUrl = (env.VITE_SITE_URL || "https://your-domain.com").replace(/\/+$/, "");
  const email = env.VITE_CONTACT_EMAIL || "hello@your-domain.com";
  const defaultLocale = normalizeDefaultLocale(env.VITE_DEFAULT_LOCALE);
  const routing = createRouting(defaultLocale);
  const routes = [...pageRoutes, ...projects.map((project) => `/work/${project.slug}`)];

  /** The full address of a page in one language: ("/work", "ka") -> "https://your-domain.com/ka/work". */
  const address = (route, locale) => `${siteUrl}${routing.localize(route, locale)}`;

  return {
    name: "web-smith-seo-files",
    transformIndexHtml: (html) =>
      html
        .replaceAll("__SITE_URL__", siteUrl)
        .replaceAll("__CONTACT_EMAIL__", email)
        .replaceAll("__DEFAULT_LOCALE__", defaultLocale)
        .replaceAll("__LOCALES__", LOCALES.join(",")),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);

      // One entry per page and language. Each entry lists every version of the page, itself included,
      // which is what search engines expect from hreflang annotations in a sitemap.
      const urls = routes
        .flatMap((route) =>
          LOCALES.map((locale) => {
            const versions = [
              ...LOCALES.map((code) => ({ hreflang: code, href: address(route, code) })),
              { hreflang: "x-default", href: address(route, defaultLocale) },
            ]
              .map((version) => `    <xhtml:link rel="alternate" hreflang="${version.hreflang}" href="${version.href}"/>`)
              .join("\n");

            return `  <url>\n    <loc>${address(route, locale)}</loc>\n${versions}\n    <lastmod>${today}</lastmod>\n    <priority>${priorityFor(route)}</priority>\n  </url>`;
          }),
        )
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "VITE_");

  // In development the form posts to /api/contact on this very server, and Vite hands it on to the Node
  // server in server/. Same address means no CORS to set up. Point it elsewhere with VITE_API_PROXY.
  const api = { "/api": { target: env.VITE_API_PROXY || "http://127.0.0.1:8787", changeOrigin: false } };

  return {
    plugins: [react(), seoFiles(env)],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Every SCSS file (global and *.module.scss) gets the shared tokens,
          // functions and mixins from src/styles/abstracts.scss for free.
          loadPaths: [path.resolve(rootDir, "src/styles")],
          additionalData: '@use "abstracts" as *;\n',
        },
      },
    },
    server: {
      host: true,
      port: 5173,
      proxy: api,
    },
    preview: {
      host: true,
      port: 4173,
      proxy: api,
    },
    build: {
      target: "es2022",
      chunkSizeWarningLimit: 800,
    },
  };
});
