import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, describe, it } from "node:test";

// These tests start the real program (src/index.js) as its own process, the way `npm start` does.
// The environment is explicit and minimal on purpose: nothing from your shell or your .env can leak in,
// so running the tests can never send a real email.

const serverRoot = fileURLToPath(new URL("..", import.meta.url));
const folders = [];
const children = [];

after(async () => {
  for (const child of children) child.kill("SIGKILL");
  await Promise.all(folders.map((folder) => rm(folder, { recursive: true, force: true })));
});

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function start(env) {
  const child = spawn(process.execPath, ["src/index.js"], {
    cwd: serverRoot,
    env: { PATH: process.env.PATH, NODE_ENV: "test", ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);

  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const exited = new Promise((resolve) => child.on("exit", (code, signal) => resolve({ code, signal })));
  return { child, exited, output: () => output };
}

async function waitFor(check, description, { timeout = 10_000, interval = 50 } = {}) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await check();
    if (value) return value;
    if (Date.now() > deadline) assert.fail(`Timed out waiting for ${description}`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

describe("the server program", () => {
  it("starts, takes an inquiry, saves the previews and shuts down cleanly", async () => {
    const previews = await mkdtemp(path.join(os.tmpdir(), "wss-startup-"));
    folders.push(previews);
    const port = await freePort();

    const server = start({
      LOG_LEVEL: "info",
      HOST: "127.0.0.1",
      PORT: String(port),
      MAIL_MODE: "preview",
      PREVIEW_DIR: previews,
      SERVE_STATIC: "false",
      SITE_URL: "https://studio.example.test",
      TIMEZONE: "Asia/Tbilisi",
    });

    await waitFor(() => /server is running/.test(server.output()), "the startup message");
    assert.match(server.output(), /PREVIEW mode/);

    const health = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.deepEqual(await health.json(), { ok: true, mail: { mode: "preview", verified: true } });

    const response = await fetch(`http://127.0.0.1:${port}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana Smith",
        email: "ana@harborpine.example",
        company: "",
        message: "We need a clean website with our menu, opening hours and online booking.",
        locale: "en",
      }),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);

    const files = await waitFor(async () => {
      const found = await readdir(previews);
      return found.length === 4 ? found : null;
    }, "the four preview files");
    assert.equal(files.filter((name) => name.endsWith(".eml")).length, 2);
    assert.equal(files.filter((name) => name.endsWith(".html")).length, 2);

    server.child.kill("SIGTERM");
    const { code } = await server.exited;
    assert.equal(code, 0, server.output());
    assert.match(server.output(), /SIGTERM received/);
  });

  it("refuses to start with a bad configuration and says what to fix", async () => {
    const port = await freePort();
    const server = start({ PORT: String(port), SMTP_HOST: "smtp.example.test", SERVE_STATIC: "false" });

    const { code } = await server.exited;
    assert.equal(code, 1);
    assert.match(server.output(), /Invalid server configuration/);
    assert.match(server.output(), /MAIL_TO/);
    assert.match(server.output(), /MAIL_FROM/);
    assert.match(server.output(), /\.env\.example/);
  });

  it("refuses preview mode in production, where it would silently drop every inquiry", async () => {
    const port = await freePort();
    const server = start({ NODE_ENV: "production", PORT: String(port), SERVE_STATIC: "false" });

    const { code } = await server.exited;
    assert.equal(code, 1);
    assert.match(server.output(), /preview mode/);
  });
});
