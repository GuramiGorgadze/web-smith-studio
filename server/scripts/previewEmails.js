// Renders the sample inquiries through the real email pipeline and saves the results as files you can open:
//
//   npm run preview:emails
//
// Open server/.previews/index.html in a browser to see every email at desktop and phone width.
// Switch your computer to dark mode and reload to see the dark design. Each email is also saved as .eml,
// which Apple Mail, Outlook and Thunderbird open like a received message. Nothing is sent.

import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "../src/config.js";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { createLogger } from "../src/lib/logger.js";
import { serverRoot } from "../src/lib/paths.js";
import { createInquiryService } from "../src/mail/inquiryService.js";
import { createMailer } from "../src/mail/mailer.js";
import { escapeHtml } from "../src/mail/html.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";

const envFile = path.join(serverRoot, ".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);

// Always preview mode, whatever the .env says, so this script can never send real mail.
const config = loadConfig({
  ...process.env,
  NODE_ENV: "development",
  MAIL_MODE: "preview",
  SERVE_STATIC: "false",
  AUTO_REPLY: "true",
  AUTO_REPLY_MAX_PER_EMAIL: "50",
  LOG_LEVEL: "silent",
});

const directory = config.mail.previewDir;
await mkdir(directory, { recursive: true });

// Clear earlier previews, touching only files this script creates.
for (const file of await readdir(directory)) {
  if (file === "index.html" || /^\d{4}-\d{2}-\d{2}T.*\.(html|eml)$/.test(file)) await rm(path.join(directory, file));
}

const logger = createLogger({ level: "silent" });
const previewMailer = createMailer({ config, logger });
const saved = [];
const mailer = {
  ...previewMailer,
  async send(message, meta) {
    const info = await previewMailer.send(message, meta);
    saved.push({ meta, subject: message.subject, files: info.files, to: [message.to].flat().join(", ") });
    return info;
  },
};
const service = createInquiryService({ config, mailer, logger });

for (const [name, sample] of Object.entries(sampleInquiries)) {
  const parsed = parseInquiry(sample);
  if (!parsed.success) throw new Error(`Sample "${name}" is not valid: ${JSON.stringify(parsed.fields)}`);
  await service.deliver(parsed.data);
  await service.idle();
}

const rows = saved
  .map((item) => {
    const file = path.basename(item.files.html);
    const kind = item.meta.kind === "notification" ? "Notification to the studio" : "Confirmation to the visitor";
    return `<section>
<h2>${escapeHtml(kind)}</h2>
<p><strong>Subject:</strong> ${escapeHtml(item.subject)}<br><strong>To:</strong> ${escapeHtml(item.to)}<br><a href="${escapeHtml(file)}">Open full size</a> · <a href="${escapeHtml(path.basename(item.files.eml))}">Download .eml</a></p>
<div class="frames"><iframe title="Desktop view" src="${escapeHtml(file)}" width="680" height="1180"></iframe><iframe title="Phone view" src="${escapeHtml(file)}" width="390" height="1180"></iframe></div>
</section>`;
  })
  .join("\n");

await writeFile(
  path.join(directory, "index.html"),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Email previews</title>
<style>body{margin:0;padding:32px 24px 64px;font:16px/1.5 system-ui,sans-serif;background:#e9e8f2;color:#0d0c10}h1{margin:0 0 4px}section{margin:40px 0}h2{margin:0 0 6px;font-size:20px}a{color:#3a3dfb}.frames{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap}iframe{border:1px solid #cfcde3;border-radius:12px;background:#fff}@media (prefers-color-scheme:dark){body{background:#0d0c10;color:#f5f5fa}a{color:#b8b4f9}iframe{border-color:#2d2c3f}}</style></head>
<body><h1>Email previews</h1><p>Nothing here was sent. Switch your computer to dark mode and reload to see the dark design.</p>
${rows}
</body></html>`,
);

console.log(`Saved ${saved.length} emails to ${directory}`);
console.log(`Open this file in your browser: ${path.join(directory, "index.html")}`);
