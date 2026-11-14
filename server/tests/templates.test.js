import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { parseInquiry } from "../src/lib/inquirySchema.js";
import { check, cidToFilePaths, inlineImages, logo } from "../src/mail/assets.js";
import { renderAutoReply } from "../src/mail/autoReply.js";
import { contrastRatio, hexToRgb, luminance } from "../src/mail/color.js";
import { formatReceived, localizedUrl } from "../src/mail/format.js";
import { URGENT_TIMELINE, labelFor, messages, optionLabels } from "../src/mail/messages.js";
import { renderNotification } from "../src/mail/notification.js";
import { sampleInquiries } from "../src/mail/sampleInquiries.js";
import { darkTargets, emailStyles, palette } from "../src/mail/theme.js";
import { testConfig } from "./helpers/config.js";

const config = testConfig();
const receivedAt = new Date("2026-11-10T15:06:00Z"); // 19:06 in Tbilisi
const reference = "a3f91c2e";

/** A sample inquiry as the server would hold it after validation. */
function inquiry(name, changes = {}) {
  const result = parseInquiry({ ...sampleInquiries[name], ...changes });
  assert.equal(result.success, true, `the "${name}" sample should be valid: ${JSON.stringify(result.fields)}`);
  return result.data;
}

const notification = (name, changes, settings = config) =>
  renderNotification({ inquiry: inquiry(name, changes), id: reference, receivedAt, config: settings });
const confirmation = (name, changes, settings = config) => renderAutoReply({ inquiry: inquiry(name, changes), id: reference, config: settings });

describe("colors", () => {
  it("converts hex to rgb, including the short form", () => {
    assert.deepEqual(hexToRgb("#3a3dfb"), [58, 61, 251]);
    assert.deepEqual(hexToRgb("#fff"), [255, 255, 255]);
  });

  it("knows the extremes of luminance and contrast", () => {
    assert.equal(luminance("#000000"), 0);
    assert.equal(luminance("#ffffff"), 1);
    assert.equal(Math.round(contrastRatio("#000000", "#ffffff")), 21);
    assert.equal(contrastRatio("#777777", "#777777"), 1);
  });
});

describe("email palette contrast (WCAG AA, 4.5:1 for text)", () => {
  const MINIMUM = 4.5;

  const textPairs = (colors) => [
    ["text on card", colors.text, colors.card],
    ["text on soft panel", colors.text, colors.soft],
    ["text on page", colors.text, colors.page],
    ["muted text on card", colors.muted, colors.card],
    ["muted text on soft panel", colors.muted, colors.soft],
    ["subtle text on card", colors.subtle, colors.card],
    ["subtle text on page (the footer)", colors.subtle, colors.page],
    ["accent text on card", colors.accent, colors.card],
    ["accent text on soft panel", colors.accent, colors.soft],
    ["pill text on pill", colors.pillText, colors.pillBg],
    ["warning text on warning pill", colors.warnText, colors.warnBg],
    ["button text on button", colors.buttonText, colors.button],
  ];

  for (const mode of ["light", "dark"]) {
    for (const [name, foreground, background] of textPairs(palette[mode])) {
      it(`${mode} mode: ${name}`, () => {
        const ratio = contrastRatio(foreground, background);
        assert.ok(ratio >= MINIMUM, `${foreground} on ${background} is ${ratio.toFixed(2)}:1, below ${MINIMUM}:1`);
      });
    }
  }

  for (const [name, foreground] of [
    ["white text", palette.header.text],
    ["lavender text", palette.header.muted],
    ["tag text", palette.header.tagText],
  ]) {
    it(`dark header: ${name}`, () => {
      const ratio = contrastRatio(foreground, palette.header.background);
      assert.ok(ratio >= MINIMUM, `${foreground} on ${palette.header.background} is ${ratio.toFixed(2)}:1`);
    });
  }
});

describe("dark mode styles", () => {
  const styles = emailStyles();

  it("has a prefers-color-scheme block and the Outlook.com variants", () => {
    assert.match(styles, /@media \(prefers-color-scheme:dark\)/);
    assert.match(styles, /\[data-ogsb\] \.bg-card/);
    assert.match(styles, /\[data-ogsc\] \.t-text/);
  });

  it("recolors every role with a dark value that exists", () => {
    for (const { selector, role } of darkTargets) {
      assert.ok(palette.dark[role], `dark palette has no "${role}" for ${selector}`);
      assert.ok(palette.light[role], `light palette has no "${role}" for ${selector}`);
      assert.ok(styles.includes(`${selector}{`), `${selector} is missing from the styles`);
      assert.ok(styles.includes(palette.dark[role]), `${palette.dark[role]} is missing from the styles`);
    }
  });

  it("includes the phone layout", () => {
    assert.match(styles, /@media only screen and \(max-width:640px\)/);
    assert.match(styles, /\.btn\{display:block !important/);
  });

  const allMarkup = [
    notification("estimateEn").html, // urgent, with an estimate: pills, panel, quote, solid button
    confirmation("estimateEn").html, // steps, recap panel, outline button
  ].join("\n");

  const classesIn = (markup) => new Set([...markup.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)).filter(Boolean));
  const themed = (name) => name.startsWith("bg-") || name === "bd" || name.startsWith("bd-") || name.startsWith("t-");

  it("gives every themed class in the emails a dark-mode rule", () => {
    const known = new Set(darkTargets.map(({ selector }) => selector.slice(1)));
    for (const name of classesIn(allMarkup).values()) {
      if (themed(name)) assert.ok(known.has(name), `class "${name}" has no dark-mode rule`);
    }
  });

  it("uses only classes that the styles define", () => {
    const layout = new Set(["outer", "px", "h1", "btn", "btn-wrap", "hide-sm"]);
    const known = new Set(darkTargets.map(({ selector }) => selector.slice(1)));
    for (const name of classesIn(allMarkup).values()) {
      assert.ok(layout.has(name) || known.has(name), `class "${name}" is not defined anywhere`);
    }
  });

  it("has no dark-mode rule that no email uses", () => {
    const used = classesIn(allMarkup);
    for (const { selector } of darkTargets) assert.ok(used.has(selector.slice(1)), `${selector} is never used`);
  });
});

describe("option labels and messages", () => {
  it("has English and Georgian text for every option", () => {
    for (const [kind, options] of Object.entries(optionLabels)) {
      for (const [id, labels] of Object.entries(options)) {
        assert.ok(labels.en?.trim(), `${kind}.${id} has no English label`);
        assert.ok(labels.ka?.trim(), `${kind}.${id} has no Georgian label`);
      }
    }
  });

  it("finds labels by id and ignores unknown or inherited ids", () => {
    assert.equal(labelFor("budget", "500-1k", "en"), "$500 to $1,000");
    assert.equal(labelFor("timeline", "asap", "ka"), "რაც შეიძლება მალე");
    assert.equal(labelFor("budget", "nope", "en"), undefined);
    assert.equal(labelFor("budget", "constructor", "en"), undefined);
    assert.equal(labelFor("budget", "__proto__", "en"), undefined);
    assert.equal(labelFor("unknown-kind", "asap", "en"), undefined);
    assert.equal(labelFor("budget", undefined, "en"), undefined);
  });

  it("keeps the Georgian messages in step with the English ones", () => {
    const shape = (value) =>
      typeof value === "function"
        ? `function/${value.length}`
        : typeof value === "object"
          ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
          : typeof value;
    assert.deepEqual(shape(messages.ka), shape(messages.en));
  });

  it("recognizes an urgent timeline written in either language", () => {
    for (const text of ["ASAP", "As soon as possible", "this is urgent", "რაც შეიძლება მალე", "სასწრაფო"]) {
      assert.ok(URGENT_TIMELINE.test(text), text);
    }
    for (const text of ["Whenever", "I am flexible", "1–2 თვეში"]) {
      assert.equal(URGENT_TIMELINE.test(text), false, text);
    }
  });
});

describe("format helpers", () => {
  it("writes the received time in the studio time zone", () => {
    const english = formatReceived(receivedAt, "en", "Asia/Tbilisi");
    assert.match(english, /Tuesday, November 10, 2026/);
    assert.match(english, /7:06\s?PM/);
    assert.match(english, /GMT\+4/);

    const georgian = formatReceived(receivedAt, "ka", "Asia/Tbilisi");
    assert.match(georgian, /2026/);
    assert.match(georgian, /19:06/);
  });

  it("puts the default language at the root and the others under a prefix", () => {
    const site = { url: "https://studio.example.test", defaultLocale: "en" };
    assert.equal(localizedUrl(site, "en", "/work"), "https://studio.example.test/work");
    assert.equal(localizedUrl(site, "ka", "/work"), "https://studio.example.test/ka/work");
    assert.equal(localizedUrl(site, "ka"), "https://studio.example.test/ka/");
    assert.equal(localizedUrl({ ...site, defaultLocale: "ka" }, "ka", "/work"), "https://studio.example.test/work");
    assert.equal(localizedUrl({ ...site, defaultLocale: "ka" }, "en", "/work"), "https://studio.example.test/en/work");
  });
});

describe("embedded images", () => {
  it("exist and are real PNG files", () => {
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    for (const image of [logo, check]) {
      assert.ok(existsSync(image.file), `${image.file} is missing`);
      assert.deepEqual(readFileSync(image.file).subarray(0, 8), signature, `${image.file} is not a PNG`);
    }
  });

  it("become inline attachments with a content id", () => {
    assert.deepEqual(inlineImages(logo, check), [
      { filename: logo.filename, path: logo.file, cid: "wss-logo", contentDisposition: "inline" },
      { filename: check.filename, path: check.file, cid: "wss-check", contentDisposition: "inline" },
    ]);
  });

  it("are swapped for relative file paths in saved previews", () => {
    const directory = path.join(path.dirname(logo.file), "..", ".previews");
    const result = cidToFilePaths('<img src="cid:wss-logo"><img src="cid:wss-check">', directory);
    assert.doesNotMatch(result, /cid:/);
    assert.match(result, /\.\.\/assets\/logo-mark\.png/);
    assert.match(result, /\.\.\/assets\/check\.png/);
  });
});

describe("studio notification", () => {
  it("shows who wrote, what they want and what they said", () => {
    const email = notification("estimateEn");

    assert.equal(email.subject, "[ASAP] New inquiry from Ana Smith: Business website");
    assert.equal(email.urgent, true);
    assert.match(email.html, /<html lang="en"/);
    assert.match(email.html, /<title>\[ASAP\] New inquiry from Ana Smith: Business website<\/title>/);

    for (const expected of [
      "Ana Smith",
      "Harbor &amp; Pine Café",
      "ana@harborpine.example",
      "Business website",
      "$500 to $1,000",
      "As soon as possible",
      "Yes, please tell me about care plans",
      "Indicative range $850 to $1,050",
      "Could we have a call this week?",
      "Reply by email",
    ]) {
      assert.ok(email.html.includes(expected), `the HTML should contain "${expected}"`);
    }

    // Small section labels are written in capitals in English.
    for (const label of ["NEW PROJECT INQUIRY", "DETAILS", "ESTIMATE FROM THE WEBSITE", "MESSAGE"]) {
      assert.ok(email.html.includes(`>${label}</p>`), `the HTML should have the label ${label}`);
    }
  });

  it("starts with useful preview text for the inbox list", () => {
    const { html } = notification("estimateEn");
    assert.match(html, /display:none[^>]*>\$500 to \$1,000 · As soon as possible · ana@harborpine\.example/);
  });

  it("links the reply button to a prefilled email in the visitor's language", () => {
    const english = notification("estimateEn").html;
    assert.ok(
      english.includes("mailto:ana@harborpine.example?subject=Re%3A%20your%20project%20inquiry%20to%20Web%20Smith%20Studio&amp;body=Hi%20Ana%2C"),
      "English visitors get an English reply",
    );

    const georgian = notification("georgian").html;
    assert.ok(georgian.includes(`body=${encodeURIComponent("გამარჯობა, ნინო!")}`), "Georgian visitors get a Georgian reply");
  });

  it("uses the studio's own wording for known option ids instead of what the form sent", () => {
    const { html } = notification("estimateEn", { projectType: "A label from somewhere else", ids: { projectType: "redesign", budget: "2k-plus", timeline: "flexible", care: false } });
    assert.ok(html.includes("Redesign or migration"));
    assert.ok(html.includes("$2,000 or more"));
    assert.ok(html.includes("Not right now"));
    assert.equal(html.includes("A label from somewhere else"), false);
  });

  it("falls back to the labels the form sent when there are no ids", () => {
    const email = notification("simpleEn", { ids: undefined, projectType: "Podcast site", budget: "A few thousand", timeline: "By spring" });
    assert.ok(email.html.includes("Podcast site"));
    assert.ok(email.html.includes("A few thousand"));
    assert.ok(email.html.includes("By spring"));
    assert.equal(email.urgent, false);
  });

  it("flags urgency from the id, or from the label when there is no id", () => {
    assert.equal(notification("simpleEn").urgent, false);
    assert.equal(notification("simpleEn").subject.startsWith("[ASAP]"), false);
    assert.equal(notification("simpleEn", { ids: undefined, timeline: "ASAP please" }).urgent, true);
    assert.equal(notification("simpleEn", { ids: { timeline: "flexible" }, timeline: "ASAP" }).urgent, false, "an id beats a label");
  });

  it("leaves out the company and estimate rows when there are none", () => {
    const email = notification("simpleEn");
    assert.doesNotMatch(email.html, /estimate from the website/i);
    assert.equal(email.text.includes("Estimate from the website"), false);
    assert.equal(email.text.includes("Company:"), false);
    assert.ok(email.html.includes("daniel@example.com"));
  });

  it("is written in the studio's language", () => {
    const georgianStudio = testConfig({ STUDIO_LOCALE: "ka" });
    const email = notification("estimateEn", {}, georgianStudio);
    assert.equal(email.subject, "[სასწრაფო] ახალი მოთხოვნა: Ana Smith · ბიზნეს ვებსაიტი");
    assert.match(email.html, /<html lang="ka"/);
    assert.ok(email.html.includes("დეტალები"));
    assert.ok(email.html.includes("პასუხის გაგზავნა"));
    assert.match(email.text, /მიღებულია: .*2026/);
  });

  it("embeds the logo and nothing remote", () => {
    const { html } = notification("estimateEn");
    assert.ok(html.includes('src="cid:wss-logo"'));
    assert.equal(html.includes("cid:wss-check"), false);
    assert.doesNotMatch(html, /<script|<iframe|<form|<link |@import|url\(\s*["']?https?:/i);
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) assert.match(href, /^(https:\/\/|mailto:)/, `unexpected link ${href}`);
  });

  it("has a plain-text version with the same facts and no markup", () => {
    const { text } = notification("estimateEn");
    assert.match(text, /^NEW PROJECT INQUIRY\nAna Smith \(Harbor & Pine Café\)\n/);
    assert.ok(text.includes("Email: ana@harborpine.example"));
    assert.ok(text.includes("Timeline: As soon as possible"));
    assert.ok(text.includes("Estimate from the website:\nBusiness website, 5 pages"));
    assert.ok(text.includes("Message:\nHi! We run a small café in Batumi"));
    assert.ok(text.includes(`Reference ${reference}`));
    assert.doesNotMatch(text, /<\/?(p|td|tr|table|div|span|a|br)\b/i);
  });

  it("stays well under the size where Gmail clips a message, even with the longest possible input", () => {
    const longest = notification("estimateEn", { message: "<".repeat(4000), estimate: ">".repeat(700), company: "&".repeat(120) });
    assert.ok(Buffer.byteLength(longest.html) < 100 * 1024, `${Buffer.byteLength(longest.html)} bytes`);
    assert.ok(Buffer.byteLength(notification("estimateEn").html) < 40 * 1024);
  });

  it("never prints placeholders for missing data", () => {
    for (const name of ["estimateEn", "simpleEn", "georgian", "tricky"]) {
      const email = notification(name);
      assert.doesNotMatch(email.html + email.text, /undefined|\[object Object\]|NaN/, name);
    }
  });
});

describe("studio notification with hostile input", () => {
  const email = notification("tricky");

  it("escapes every tag the visitor typed", () => {
    assert.equal(email.html.includes("<script>alert(1)"), false);
    assert.equal(email.html.includes("<img src=x"), false);
    assert.equal(email.html.includes("<b>Sons</b>"), false);
    assert.equal(email.html.includes("<i>custom</i>"), false);
    assert.ok(email.html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
    assert.ok(email.html.includes("&lt;b&gt;Sons&lt;/b&gt;"));
    assert.equal(/<script/i.test(email.html), false);
    assert.equal(email.html.match(/<img\b/g)?.length, 1, "only the logo is an image");
  });

  it("does not turn pasted links into links", () => {
    assert.equal(email.html.includes('href="https://example.com/a/really'), false);
  });

  it("keeps the subject on one line", () => {
    const subject = notification("tricky", { name: "Ana\r\nBcc: evil@example.com" }).subject;
    assert.doesNotMatch(subject, /[\r\n]/);
  });
});

describe("visitor confirmation", () => {
  it("thanks the visitor by first name, in English", () => {
    const email = confirmation("simpleEn");
    assert.equal(email.subject, "We got your message | Web Smith Studio");
    assert.match(email.html, /<html lang="en"/);
    for (const expected of [
      "Thanks, Daniel. Your message is in.",
      "daniel@example.com",
      "within one business day",
      "Landing page",
      "Under $500",
      "I am flexible",
      "We read every message",
      "See our work",
      "https://studio.example.test/work",
      "The Web Smith Studio team",
      `Reference ${reference}`,
      "studio.example.test",
    ]) {
      assert.ok(email.html.includes(expected), `the HTML should contain "${expected}"`);
    }

    // Small section labels are written in capitals in English.
    for (const label of ["YOUR REQUEST", "WHAT HAPPENS NEXT"]) {
      assert.ok(email.html.includes(`>${label}</p>`), `the HTML should have the label ${label}`);
    }
    assert.ok(email.html.includes('src="cid:wss-check"'));
    assert.ok(email.html.includes('src="cid:wss-logo"'));
  });

  it("answers Georgian visitors in Georgian, with Georgian links", () => {
    const email = confirmation("georgian");
    assert.equal(email.subject, "თქვენი შეტყობინება მივიღეთ | Web Smith Studio");
    assert.match(email.html, /<html lang="ka"/);
    for (const expected of [
      "გმადლობთ, ნინო. შეტყობინება მივიღეთ.",
      "ერთი სამუშაო დღის განმავლობაში",
      "ლენდინგ გვერდი",
      "რა მოხდება შემდეგ",
      "https://studio.example.test/ka/work",
      "ნომერი: a3f91c2e",
    ]) {
      assert.ok(email.html.includes(expected), `the HTML should contain "${expected}"`);
    }
    assert.ok(email.text.includes("1. ყველა შეტყობინებას ვკითხულობთ"));
  });

  it("uses the configured response time", () => {
    const email = confirmation("simpleEn", {}, testConfig({ RESPONSE_TIME: "within 4 hours" }));
    assert.ok(email.html.includes("within 4 hours"));
    assert.equal(email.html.includes("within one business day"), false);
  });

  it("links to the right language when Georgian is the default", () => {
    const georgianDefault = testConfig({ DEFAULT_LOCALE: "ka" });
    assert.ok(confirmation("georgian", {}, georgianDefault).html.includes('href="https://studio.example.test/work"'));
    assert.ok(confirmation("simpleEn", {}, georgianDefault).html.includes('href="https://studio.example.test/en/work"'));
  });

  it("repeats nothing the visitor typed, apart from their first name and their own address", () => {
    for (const name of ["estimateEn", "tricky"]) {
      const email = confirmation(name);
      const combined = `${email.subject}\n${email.html}\n${email.text}`;
      for (const secret of [
        "Harbor",
        "Pine",
        "Café",
        "Batumi",
        "Indicative range",
        "second location",
        "Acme",
        "Rockets",
        "Sons",
        "custom",
        "<script",
        "&lt;script",
        "alert",
        "O'Brien",
        "O&#39;Brien",
        "quotes",
        "really/long/path",
      ]) {
        assert.equal(combined.includes(secret), false, `${name}: the confirmation must not repeat "${secret}"`);
      }
    }
    assert.ok(confirmation("tricky").html.includes("Zoë"));
    assert.ok(confirmation("tricky").html.includes("zoe+test@example.org"));
  });

  it("leaves the name out when it is not a plain name", () => {
    for (const name of ["evil.com", "http://evil.example", "$1000 now"]) {
      const email = confirmation("simpleEn", { name });
      assert.ok(email.html.includes("Thanks. Your message is in."), name);
      assert.equal(email.html.includes(name.split(" ")[0]), false, name);
    }
  });

  it("omits the request recap when there are no option ids", () => {
    const email = confirmation("simpleEn", { ids: undefined });
    assert.doesNotMatch(email.html, /your request/i);
    assert.equal(email.text.includes("Your request:"), false);
  });

  it("has a plain-text version", () => {
    const { text } = confirmation("simpleEn");
    assert.match(text, /^Thanks, Daniel\. Your message is in\.\n\nWe will reply to daniel@example\.com within one business day/);
    assert.ok(text.includes("Your request:\n- Project type: Landing page\n- Budget: Under $500\n- Timeline: I am flexible"));
    assert.ok(text.includes("1. We read every message"));
    assert.ok(text.includes("See our work: https://studio.example.test/work"));
    assert.doesNotMatch(text, /<\/?(p|td|tr|table|div|span|a|br)\b/i);
  });

  it("only contains secure links", () => {
    for (const name of ["simpleEn", "georgian"]) {
      for (const [, href] of confirmation(name).html.matchAll(/href="([^"]+)"/g)) assert.match(href, /^https:\/\//, href);
    }
  });

  it("never prints placeholders for missing data", () => {
    for (const name of ["estimateEn", "simpleEn", "georgian", "tricky"]) {
      const email = confirmation(name);
      assert.doesNotMatch(email.html + email.text, /undefined|\[object Object\]|NaN/, name);
    }
  });
});
