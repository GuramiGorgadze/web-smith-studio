# Web Smith Studio website

The marketing site for Web Smith Studio, a studio that builds websites for local and international businesses.

Built with React 19, Vite 8, React Router 7, Radix UI primitives wrapped in shadcn-style components, SCSS modules, and react-hook-form with zod for the contact form.

The whole site is in **English and Georgian** (`/work` and `/ka/work`), with a language switch, its own fonts, search-engine language tags and Georgian confirmation emails. See [Languages](#languages-english-and-georgian).

The contact form is received by a small Node.js server in [`server/`](./server/README.md) that checks each inquiry and uses Nodemailer to send you a designed notification email and the visitor a confirmation.

## Run it

Needs Node.js 20.19 or newer (22 recommended).

```bash
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build at http://localhost:4173
npm test          # the website's tests: both languages' words, the estimator, the match with the mail server
```

With the mail server (needs `VITE_FORM_ENDPOINT=/api/contact` in `.env`, see below):

```bash
npm run server:install   # once: installs the server's packages
npm run server:dev       # terminal 1: the mail server on http://localhost:8787 (saves emails as files until you add SMTP settings)
npm run dev              # terminal 2: the website; Vite passes /api requests on to the server
npm run server:test      # the server's test suite
npm run server:emails    # builds sample emails to look at: server/.previews/index.html
```

`npm start` runs the mail server in production mode; when `dist/` exists it also serves the website, so one program hosts everything. Setup, Gmail and other SMTP accounts, hosting and troubleshooting are in [`server/README.md`](./server/README.md).

## What is in it

Every route below also exists in Georgian under `/ka` (`/ka/pricing`, `/ka/work/atelier-voss`, ...).

| Route | Page |
| --- | --- |
| `/` | Landing page: hero, stats, tech marquee, services, the scroll-driven "how we work" tour, concept projects, live project estimator, pricing with a care-plan switch, FAQ and closing call to action |
| `/services` | Every service in detail, with a sticky section menu that follows your scroll |
| `/work` | Project grid with Radix filter tabs |
| `/work/:slug` | Six case-study pages (each labelled **Concept**), with a "next project" link |
| `/pricing` | Packages, how pricing works, the estimator, what is always included, FAQ |
| `/about` | Story, values and disciplines |
| `/contact` | Validated inquiry form, prefilled from the estimator and the pricing and services buttons |
| `/privacy`, `/terms` | Plain-language starter documents with an "on this page" list |
| anything else | A 404 page (marked `noindex`) |

Also included: English and Georgian, light, dark and system themes (saved in the browser), a Radix navigation menu and a mobile menu sheet, a skip link, reduced-motion support, per-page titles, descriptions, canonical and language-alternate links and social tags, and JSON-LD structured data (organization, breadcrumbs and FAQ).

## Project structure

```
src/
  main.jsx, App.jsx          entry point, providers
  routes/                    router (every page is a lazy route), loading and error screens
  pages/                     one folder per route (Home, Services, Work, WorkDetail, Pricing, About, Contact, ...)
  components/
    ui/                      shadcn-style primitives on Radix (button, dialog, tabs, slider, select, ...)
    common/                  layout helpers (Section, Container, Reveal, Marquee, PageHero, ...)
    brand/                   logo as inline SVG
    layout/                  navbar, mobile nav, footer, SEO head, theme toggle
    sections/                page sections, one folder per area (home, services, work, pricing, about, contact, legal, ...)
  content/en/, content/ka/   all the words of the site, one folder per language, the same 18 files in each
  i18n/                      language routing, the text helper, the language switch's memory, loading
  data/                      language-free facts (studio name, address, email, social links, tech list)
  lib/                       estimator maths, contact form schema and submit logic, formatting, structured data
  hooks/, context/           small hooks, theme context
  styles/                    design tokens, mixins and the global base styles
public/                      favicon, web manifest, social images (English and Georgian), _redirects
tests/                       website tests (npm test)
design/                      the original logo image, kept for reference (not used by the site)
server/                      the Node mail server: API, email designs, tests (its own README and package.json)
Dockerfile                   builds the website and the server into one image (not built by its author, try it first)
vite.config.js               build setup, /api proxy for development, and the plugin that writes sitemap.xml and robots.txt
```

Every component has its own `.module.scss` file next to it. Shared tokens, functions and mixins from `src/styles/abstracts.scss` are available in every SCSS file without an import.

## Make it yours

- **Colors, fonts and spacing:** `src/styles/_theme.scss` (dark and light tokens as CSS variables). The dark base `#0d0c10` is the theme color published by psychsat.com, the reference for the look; the blue to indigo to lavender accents come from the Web Smith logo.
- **Studio facts that do not depend on language (name, address, email, social links):** `src/data/site.js`.
- **Words (tagline, copy, services, FAQ, projects, legal text, form labels, error messages):** `src/content/en/` for English and `src/content/ka/` for Georgian. Find the sentence in one of those files and change it. Prices shown in the text are in `pricing.js` and `sections.js`.
- **Estimator numbers:** `src/lib/estimator.js`. Its words are in `src/content/<language>/estimator.js`.
- **Site address, contact email, form endpoint:** copy `.env.example` to `.env` and fill it in (see below).
- **Adding a team section:** add the people to `src/data/about.js`, build a small `TeamSection` next to `AboutStory` in `src/components/sections/about/`, and place it in `src/pages/About/AboutPage.jsx`. No team members are shown today because none were provided.

## Languages (English and Georgian)

- **Addresses.** The default language has the plain addresses (`/pricing`), every other language lives under its code (`/ka/pricing`). `VITE_DEFAULT_LOCALE=ka` swaps them.
- **Switching.** The header has a button that shows the other language (in the mobile menu both languages are listed). It keeps the page, the query and the `#section`, and remembers the choice in the browser (`localStorage` key `wss-locale`, no cookie, nothing sent anywhere). Mention it in your privacy policy if you want to be exact; the starter policy already covers browser storage.
- **First visit.** Only on the home address `/`, and only when the visitor has not chosen a language before, a browser set to Georgian is taken to `/ka`. Deep links are never redirected, so a shared link always opens the language it was shared in.
- **Search engines.** Every page declares `lang`, a canonical address, `hreflang` alternates (`en`, `ka`, `x-default`) and `og:locale`; `sitemap.xml` lists both languages with the alternates. Georgian has its own social image, `public/og-image-ka.png`. As noted under Deploying, chat apps that do not run scripts show the home card for deep links.
- **Fonts.** Georgian letters use Noto Sans Georgian, downloaded only when a page contains them. Georgian text gets no negative letter-spacing and a little more line height (`:lang(ka)` rules in `src/styles/_base.scss`). Brand and technology names stay in Latin letters; where a Georgian ending follows one, it is attached with a hyphen (`Web Smith Studio-ს`).
- **Emails.** The form sends the language and stable option ids with every inquiry. The visitor's confirmation comes in their language; your notification is always in the studio's language (`STUDIO_LOCALE` in `server/.env`), with the reply prefilled in the visitor's language. Details in [`server/README.md`](./server/README.md).

### Change a Georgian or English sentence

Open the matching file in `src/content/ka/` (or `en/`), edit the text, save. Two small marks exist inside sentences: `{name}` is replaced by a value (the studio name, a price, a count), and tags such as `<strong>...</strong>` or `<terms>...</terms>` mark a part to emphasise or turn into a link. Keep the marks exactly as they are in English; `npm test` fails if a mark is missing or misspelled in a language.

### Add a language

1. Add its code to `LOCALES` and describe it in `LOCALE_META` in `src/i18n/locales.js`.
2. Copy `src/content/en/` to `src/content/<code>/` and translate the files. The site finds the folder by itself.
3. Add it to `LOCALES` in `server/src/lib/inquirySchema.js` and write its `notification` and `autoReply` wording and option labels in `server/src/mail/messages.js`.
4. If its script is not Latin, Cyrillic or Georgian, add a font (see `src/styles/_fonts.scss`).
5. Run `npm test` and `npm run server:test`. They list everything that is still missing.

### Tests

`npm test` checks, for every language: the same files and keys as English, every `{mark}` and tag present, no raw English left over by accident, Georgian letters in every Georgian sentence, no stray spaces, search-result lengths, the estimator's numbers and wording, and that the site and the mail server use the same languages, option ids and option wording. `npm run server:test` runs the server's own tests.

## Settings (`.env`)

| Variable | What it does |
| --- | --- |
| `VITE_SITE_URL` | Public address, for example `https://www.example.com`. Used for canonical links, social previews, the sitemap and `robots.txt`. |
| `VITE_CONTACT_EMAIL` | The address shown on the site, and where inquiries go when no form endpoint is set (the visitor's mail app opens instead). |
| `VITE_DEFAULT_LOCALE` | The language of the plain addresses: `en` (default) or `ka`. The other language lives under its code. With `ka`, `/work` is Georgian and `/en/work` is English. |
| `VITE_FORM_ENDPOINT` | Where the form posts. `/api/contact` for the mail server in `server/` (also right in production when that server hosts the site). A full URL for a form service (Formspree, Getform, Basin) or a mail server on another address. Empty for no server. |
| `VITE_API_PROXY` | Development only. Where Vite sends `/api` requests. Defaults to `http://127.0.0.1:8787`, the mail server's default address. |

The mail server has its own settings file, `server/.env` (copy `server/.env.example`). Restart `npm run dev`, or rebuild, after changing the website's settings.

### How the contact form sends

- **With the mail server (`/api/contact`):** the form POSTs JSON: name, email, company, the readable project type, budget and timeline, care-plan interest, the attached estimate if any, the message, plus the stable option ids and the language (`ids`, `locale`) that let the server write its emails in the studio's wording and the visitor's language. The server delivers the notification to you and sends the visitor a confirmation. If it is down, the mail server refuses the message or the visitor sends too many, the form shows a clear message and keeps what the visitor typed.
- **With a form service URL:** the same JSON goes to that service. Extra fields such as `ids` and `locale` are ignored or stored, depending on the service.
- **Without `VITE_FORM_ENDPOINT`:** the visitor's mail app opens with everything prefilled and addressed to `VITE_CONTACT_EMAIL`, and the thank-you screen offers an "Open my email app" button in case nothing opened.
- A hidden honeypot field catches most bots; a filled one shows the normal thank-you but sends nothing.

## Deploying

There are two ways to host it.

**One Node server for site and form (simplest, nothing else to set up).** Build the site (`npm run build`) and run the mail server with `NODE_ENV=production npm start`. It serves the website, the form endpoint and the single-page fallback together, with caching, compression and strict security headers. This needs a host that runs Node.js (Render, Railway, Fly.io, a VPS, the included `Dockerfile`). The steps and settings are in [`server/README.md`](./server/README.md).

**A static host for the site, plus the mail server somewhere else.** It is a single-page app, so every path must serve `index.html`. `public/_redirects` (Netlify, Cloudflare Pages) and `vercel.json` (Vercel) are already included. For any other host, add the same "send everything to `/index.html`" rule. Build with `VITE_FORM_ENDPOINT` set to the mail server's full address and add the site's address to `CORS_ORIGIN` in `server/.env`. Static hosts cannot run the mail server, so without a separate Node host use a form service instead.

`npm run build` also writes `dist/sitemap.xml` (all pages and case studies, in both languages, with language alternates) and `dist/robots.txt`, using `VITE_SITE_URL`. Set it before your production build. In your Instagram bio, link to the language you want first: `https://your-domain.com/ka` for Georgian followers.

Page titles and descriptions are set in the browser. Search engines read them fine, but some chat and social apps only read the raw HTML, so a deep link such as `/work/atelier-voss` previews with the home page card. If that matters to you, add prerendering later (for example with a static-site build step) without changing any component.

## Sample content to replace before launch

- Prices, timelines, the "48h / 95+ / 100%" figures, the response-time promise and the three promises under the hero buttons are sample figures. So are the pricing principles on `/pricing`.
- The six projects under `/work` are fictional concepts on `.example` domains and are labelled **Concept** everywhere. Replace them with real case studies as you ship.
- `hello@your-domain.com`, `https://your-domain.com` and the social links are placeholders.
- There are no testimonials, client logos or results on the site, because none were provided. Add real ones when you have them.
- **The Georgian text was written by an AI assistant and has not been reviewed by a native speaker.** Have a Georgian speaker read it (the legal pages, prices, form messages and emails above all) before launch. The wording rules used (formal "თქვენ", Latin brand names, "მხარდაჭერის გეგმა" for care plan, ...) are easy to change in `src/content/ka/`; the form greets people by first name ("გმადლობთ, ანა"), which is not always grammatical in Georgian for every name.
- The privacy policy and terms are plain-language starters. Have a lawyer review them for your country and your services.
