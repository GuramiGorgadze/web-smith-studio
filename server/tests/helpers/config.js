import os from "node:os";
import path from "node:path";
import { loadConfig } from "../../src/config.js";

/** A valid configuration for tests (preview mail, no static site), with any setting overridden. */
export function testConfig(overrides = {}) {
  return loadConfig({
    NODE_ENV: "test",
    SITE_URL: "https://studio.example.test",
    MAIL_TO: "inbox@studio.example.test",
    MAIL_FROM: "Web Smith Studio <no-reply@studio.example.test>",
    MAIL_MODE: "preview",
    TIMEZONE: "Asia/Tbilisi",
    SERVE_STATIC: "false",
    PREVIEW_DIR: path.join(os.tmpdir(), "wss-test-previews"),
    ...overrides,
  });
}
