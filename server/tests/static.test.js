import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import http from "node:http";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { loadConfig } from "../src/config.js";
import { inlineScriptHashes } from "../src/middleware/staticSite.js";
import { testConfig } from "./helpers/config.js";
import { createFakeMailer } from "./helpers/fakeMailer.js";
import { startApp } from "./helpers/server.js";

const THEME_SCRIPT = `document.documentElement.dataset.theme = "dark";`;

const INDEX = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Static test</title>
<script>${THEME_SCRIPT}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization"}</script>
<script type="module" crossorigin src="/assets/app-abc123.js"></script>
</head>
<body><div id="root"></div></body>
</html>
`;

const hashOf = (text) => `'sha256-${createHash("sha256").update(text).digest("base64")}'`;

describe("inlineScriptHashes", () => {
  it("hashes the executable inline scripts of a page and nothing else", () => {
    assert.deepEqual(inlineScriptHashes(INDEX), [hashOf(THEME_SCRIPT)]);
  });

  it("copes with several scripts, upper-case tags and attributes", () => {
    const markup = [
      `<script type="module">import "/a.js"</script>`,
      `<SCRIPT>1+1</SCRIPT>`,
      `<script src="/x.js"></script>`,
      `<script type="text/plain">not code</script>`,
      `<script>   </script>`,
    ].join("");
    assert.deepEqual(inlineScriptHashes(markup), [hashOf('import "/a.js"'), hashOf("1+1")]);
  });

  it("returns nothing for a page without inline scripts", () => {
    assert.deepEqual(inlineScriptHashes("<html><body>Hello</body></html>"), []);
  });
});

describe("serving the built website", () => {
  let directory;
  let site;
  let baseUrl;
  let port;

  before(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "wss-dist-"));
    await mkdir(path.join(directory, "assets"));
    await writeFile(path.join(directory, "index.html"), INDEX);
    await writeFile(path.join(directory, "assets", "app-abc123.js"), `console.log("${"x".repeat(5000)}");`);
    await writeFile(path.join(directory, "robots.txt"), "User-agent: *\nAllow: /\n");
    await writeFile(path.join(directory, ".secret"), "TOP SECRET");

    const config = testConfig({ SERVE_STATIC: "true", STATIC_DIR: directory });
    site = await startApp({ config, mailer: createFakeMailer() });
    baseUrl = site.baseUrl;
    port = Number(new URL(baseUrl).port);
  });

  after(async () => {
    await site.close();
    await rm(directory, { recursive: true, force: true });
  });

  /** A request with the path exactly as written, so ".." and encoded dots are not tidied up by the client. */
  const rawGet = (rawPath) =>
    new Promise((resolve, reject) => {
      http
        .get({ host: "127.0.0.1", port, path: rawPath }, (response) => {
          let body = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => (body += chunk));
          response.on("end", () => resolve({ status: response.statusCode, body }));
        })
        .on("error", reject);
    });

  it("serves the page shell at the root, never cached", async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.equal(response.headers.get("cache-control"), "no-cache");
    assert.ok((await response.text()).includes('<div id="root">'));
  });

  it("answers every page address with the shell, so a refresh or a shared link works", async () => {
    for (const address of ["/work", "/services", "/ka", "/ka/work", "/work/some-project/", "/legal/privacy"]) {
      const response = await fetch(`${baseUrl}${address}`);
      assert.equal(response.status, 200, address);
      assert.equal(response.headers.get("cache-control"), "no-cache", address);
      assert.ok((await response.text()).includes('<div id="root">'), address);
    }
  });

  it("answers HEAD requests for pages without a body", async () => {
    const response = await fetch(`${baseUrl}/work`, { method: "HEAD" });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "");
  });

  it("caches hashed assets for a year and other files for an hour", async () => {
    const asset = await fetch(`${baseUrl}/assets/app-abc123.js`);
    assert.equal(asset.status, 200);
    assert.equal(asset.headers.get("cache-control"), "public, max-age=31536000, immutable");

    const robots = await fetch(`${baseUrl}/robots.txt`);
    assert.equal(robots.status, 200);
    assert.equal(robots.headers.get("cache-control"), "public, max-age=3600");
    assert.match(await robots.text(), /User-agent/);
  });

  it("compresses text files", async () => {
    const response = await fetch(`${baseUrl}/assets/app-abc123.js`, { headers: { "Accept-Encoding": "gzip" } });
    assert.equal(response.headers.get("content-encoding"), "gzip");
  });

  it("allows the page's own inline script by hash, and nothing else inline", async () => {
    const policy = (await fetch(`${baseUrl}/`)).headers.get("content-security-policy");
    assert.ok(policy.includes(`script-src 'self' ${hashOf(THEME_SCRIPT)}`), policy);
    assert.equal(policy.includes("'unsafe-inline'") && /script-src[^;]*'unsafe-inline'/.test(policy), false);
  });

  it("answers a missing file with 404 rather than the page shell", async () => {
    for (const address of ["/missing.js", "/assets/old-hash.js", "/picture.png", "/sitemap.xml"]) {
      const response = await fetch(`${baseUrl}${address}`);
      assert.equal(response.status, 404, address);
      assert.equal(await response.text(), "Not found", address);
    }
  });

  it("answers only GET and HEAD with pages", async () => {
    const response = await fetch(`${baseUrl}/work`, { method: "POST" });
    assert.equal(response.status, 404);
  });

  it("keeps the API working next to the website", async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).ok, true);

    const unknown = await fetch(`${baseUrl}/api/unknown`);
    assert.equal(unknown.status, 404);
    assert.equal((await unknown.json()).error.code, "not_found", "an API 404 is JSON, not the page shell");

    const contact = await fetch(`${baseUrl}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    assert.equal(contact.status, 422);
  });

  it("does not serve hidden files", async () => {
    const response = await fetch(`${baseUrl}/.secret`);
    assert.equal((await response.text()).includes("TOP SECRET"), false);
  });

  it("does not leave the folder, even with encoded dots", async () => {
    for (const rawPath of ["/%2e%2e/%2e%2e/etc/passwd", "/..%2f..%2f..%2fetc%2fpasswd", "/assets/..%2f..%2fpackage.json", "/%2e%2e%2fpackage.json"]) {
      const { body } = await rawGet(rawPath);
      assert.equal(body.includes("root:"), false, rawPath);
      assert.equal(body.includes('"name": "web-smith-studio-server"'), false, rawPath);
    }
  });
});

describe("deciding whether to serve the website", () => {
  it("serves it automatically when a build is there, and not otherwise", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "wss-dist-"));
    try {
      const env = { SERVE_STATIC: "auto", STATIC_DIR: directory };
      assert.equal(loadConfig(env).static.enabled, false);
      await writeFile(path.join(directory, "index.html"), INDEX);
      assert.equal(loadConfig(env).static.enabled, true);
      assert.equal(loadConfig({ ...env, SERVE_STATIC: "false" }).static.enabled, false);
      assert.equal(loadConfig({ ...env, SERVE_STATIC: "true" }).static.enabled, true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
