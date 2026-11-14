# Web Smith Studio mail server

A small Node.js server for the website's contact form. It checks each inquiry, then uses [Nodemailer](https://nodemailer.com) to send two designed emails:

1. **A notification to you** with everything the visitor entered, a "Reply by email" button that opens a ready-written answer, and an ASAP flag when the visitor is in a hurry.
2. **A short confirmation to the visitor** ("We got your message") with a recap of what they asked for and what happens next.

```
visitor's browser ──► /api/contact ──► this server ──► your SMTP account ──► your inbox
   (the website)        (JSON)        validate, clean,     (Gmail, Brevo,       + the visitor's
                                       build the emails     your hosting ...)       inbox
```

The same server can also serve the finished website, so one program runs everything.

Needs Node.js 20.19 or newer (22 recommended).

## Try it in two minutes (no email account needed)

Without any settings the server runs in **preview mode**: it builds the real emails and saves them as files instead of sending them.

```bash
cd server
npm install

npm run preview:emails      # builds sample emails, then open server/.previews/index.html in your browser
npm run dev                 # starts the API on http://localhost:8787 and restarts when you edit a file
```

To see the whole chain with the website, open a second terminal in the project root:

```bash
cp .env.example .env        # makes the form post to /api/contact (Vite hands it on to this server)
npm run dev                 # the website on http://localhost:5173
```

Fill in the contact form. The server saves the two emails (`.eml` files plus `.html` pages you can open in a browser) in `server/.previews/`.

## Send real email

1. **Choose an SMTP account**, the "outgoing mail" login of any email provider. The quickest start is a Gmail address:
   turn on 2-Step Verification, create an [App password](https://myaccount.google.com/apppasswords) and use it as `SMTP_PASS` (remove the spaces). Gmail always sends as the logged-in address, so `MAIL_FROM` must be that same address. Brevo, Mailgun, Resend, Postmark, Zoho or the mailbox that came with your hosting work too; `.env.example` lists the host names.
2. **Create your settings file:** copy `server/.env.example` to `server/.env` and fill in at least:

   ```
   SITE_URL=https://your-real-domain.com
   MAIL_TO=the-inbox-that-receives-inquiries@example.com
   MAIL_FROM=Web Smith Studio <your-sending-address@example.com>
   TIMEZONE=Asia/Tbilisi
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-name@gmail.com
   SMTP_PASS=your-app-password
   ```

   The server refuses to start with the example addresses from the file, so a message can never go to a stranger by mistake.
3. **Check it:** `npm run send:test` logs in, then sends a sample inquiry to `MAIL_TO` and the confirmation to the same address. Add an address (`npm run send:test -- you@example.com`) to send the confirmation somewhere else, or `-- --ka` for the Georgian sample. Look in the spam folder the first time.
4. **Start it:** `npm start` (or `NODE_ENV=production npm start` on a real server).

On startup the server logs whether it is sending or only previewing, and checks the SMTP login in the background. A wrong password is reported there, but the server keeps running, so the website never goes down because of a mail problem.

## What visitors and you see

- **Notification** (to `MAIL_TO`): the sender line reads "Ana Smith via Web Smith Studio", *Reply* goes straight to the visitor, and the subject is `New inquiry from Ana Smith: Business website`. An ASAP timeline adds `[ASAP]` to the subject and marks the email important. Written in `STUDIO_LOCALE` (English or Georgian), with times in your `TIMEZONE`.
- **Confirmation** (to the visitor): in the language the visitor used on the website, from `MAIL_FROM`, replies go to `MAIL_TO`. It never repeats what the visitor typed, apart from their first name and their own address.
- Both are designed for every mail app: a table layout with the logo embedded in the message, dark mode that follows the reader's setting, a layout that fits phones, a plain-text version, and colors checked for readable contrast. Preview them any time with `npm run preview:emails`.

## How it protects you and your visitors

- Every field is validated and cleaned again on the server (the browser is never trusted). Line breaks and hidden characters are stripped from names and subjects, so nobody can inject extra headers or recipients.
- All visitor text is escaped before it goes into HTML, so pasted code or links stay plain text. A visitor's name cannot make the sender line look like another address.
- The confirmation contains only our own wording, so the form cannot be used to send arbitrary text or links to someone else's inbox through your domain. It is limited to 3 per address per 24 hours (`AUTO_REPLY_MAX_PER_EMAIL`); your own notification is never limited that way.
- One visitor address can send 5 inquiries per 15 minutes (`RATE_LIMIT_MAX`), the whole API accepts 120 requests a minute per address, and a request body over 32 KB is refused.
- A hidden "website" field catches simple bots: a filled one gets a normal "thanks" and nothing is sent.
- Browsers may only call the API from `SITE_URL` (and from localhost while developing). Pages served by this program get strict security headers, including a Content-Security-Policy that allows no inline scripts except the site's own theme script, matched by its hash.
- The SMTP connection must be encrypted unless it goes to this very machine, so the password and messages never travel in the clear.
- Logs never contain message text, names or full email addresses (`a***@example.com`).
- Preview mode cannot run in production, and running the tests never reads your `.env`, so a test can never send real email.

## The API

| Request | Answer |
| --- | --- |
| `POST /api/contact` with a JSON body | `200 {"ok":true,"id":"a3f91c2e"}` after the notification was delivered |
| invalid fields | `422 {"ok":false,"error":{"code":"validation_failed","message":"...","fields":{"email":"..."}}}` |
| too many requests | `429` with `"code":"rate_limited"` |
| the mail server refused or was unreachable | `502` with `"code":"delivery_failed"` (the message points visitors to your address) |
| invalid JSON or a body over 32 KB | `400` or `413` |
| `GET /api/health` | `200 {"ok":true,"mail":{"mode":"smtp","verified":true}}` (`verified` is `null` until the first check finishes) |
| any other `/api/...` address | `404` as JSON |

The body the website sends: `name`, `email`, `company`, `projectType`, `budget`, `timeline`, `careInterest`, `estimate` and `message` (readable labels), plus `ids` (`projectType`, `budget`, `timeline`, `care`) and `locale` (`"en"` or `"ka"`). `ids` let the emails use the studio's own wording and language; without them the labels are used. The honeypot field is called `website`.

## Putting it online

**One server for everything (simplest).** Build the website, then run this server next to the `dist` folder. It serves the site, the API and the single-page-app fallback, with caching and compression.

```bash
npm install && npm run build                # in the project root, with VITE_FORM_ENDPOINT=/api/contact in .env
npm --prefix server install --omit=dev
NODE_ENV=production npm start               # settings come from the host's environment variables or server/.env
```

On Render, Railway, Fly.io, a VPS or similar: the build command is `npm install --include=dev && npm run build && npm --prefix server install --omit=dev`, the start command is `npm start`, and the settings from `.env.example` go into the host's environment variables page. Check the health address `/api/health`. (`--include=dev` matters: many hosts set `NODE_ENV=production` while building, which would otherwise skip Vite and make the build fail.)

Set `TRUST_PROXY` when a proxy or load balancer sits in front (`1` is right for almost every host). Without it every visitor looks like the proxy and shares one rate limit.

**Docker.** The `Dockerfile` in the project root builds that same setup into one image. It has not been built or run by its author, because there was no Docker in the environment it was written in: try it once before you rely on it. The settings are passed when you run it, never baked in:

```bash
docker build -t web-smith-studio --build-arg VITE_SITE_URL=https://your-domain.com --build-arg VITE_CONTACT_EMAIL=hello@your-domain.com .
docker run -p 8787:8787 -e NODE_ENV=production --env-file server/.env web-smith-studio
```

**Website and server in different places** (for example a static host plus a small Node host): build the website with `VITE_FORM_ENDPOINT=https://api.your-domain.com/api/contact`, run this server with `SERVE_STATIC=false` and `CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com`.

To keep it running on a plain VPS, use a process manager such as `pm2 start src/index.js --name web-smith-studio` or a systemd service, and put Nginx or Caddy in front for HTTPS.

## Deliverability (so the emails reach the inbox)

- Send from an address on a domain you own, and make sure your SMTP provider is authorised for it (their dashboard shows the SPF and DKIM records to add to your DNS). Add a DMARC record when you can.
- Gmail and some hosts rewrite or reject a `MAIL_FROM` that is not the account's own address.
- Confirmation emails carry `Auto-Submitted: auto-replied`, so well-behaved systems never answer them automatically and mail loops cannot start.
- The first emails often land in spam; mark them "not spam" once.

## Troubleshooting

| What you see | What it means |
| --- | --- |
| `EAUTH` or "Invalid login" | Wrong user or password. Gmail needs an App password, not your normal one. |
| `ECONNECTION`, `ETIMEDOUT`, `ECONNREFUSED` | Wrong `SMTP_HOST` or `SMTP_PORT`, or your host blocks outgoing mail ports. Try 465 with `SMTP_SECURE=true`, or ask the host. |
| "MAIL_TO is still the example address" | Replace `you@your-domain.com` in `.env` with your real inbox. |
| The log says "PREVIEW mode" but you set SMTP | The file must be named `.env` and sit inside `server/`, and `SMTP_HOST` must not be empty. |
| The form says "Something went wrong" | Open `/api/health` and the server log. A `502` means the mail server refused the message. |
| The form says "You have sent several messages" | The rate limit. Behind a proxy, set `TRUST_PROXY`. |
| Browser console shows a CORS error | The site and this server are on different addresses: set `CORS_ORIGIN` to the site's address. |

## Settings

Every setting, with explanations and provider examples, is in [`.env.example`](./.env.example). A real environment variable always wins over `server/.env`.

## Tests

```bash
npm test
```

Runs about 200 tests in a few seconds: validation and cleaning, HTML escaping, the email templates (including a contrast check of every text color in light and dark mode), the API with a stand-in mailer, and real SMTP conversations against a small mail server started inside the tests (headers, Georgian text, embedded images, wrong passwords, retries, refused messages, TLS required). They stay on your machine: no internet, no `.env`, no real mailbox.

## Folder map

```
server/
  src/
    index.js            starts everything, shuts down gracefully
    app.js              the Express app: security, CORS, limits, routes, static site
    config.js           reads and checks every setting, and says what is wrong in one list
    routes/             POST /api/contact, GET /api/health
    middleware/         security headers, CORS, rate limits, errors, static hosting
    lib/                validation schema, text cleaning, logger, small helpers
    mail/               the emails: layout, components, theme, wording (English and Georgian), sending
  assets/               the logo and check mark embedded in the emails
  scripts/              preview:emails and send:test
  tests/                the test suite and its helpers
```
