import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { createLogger } from "../src/lib/logger.js";

function capture(options) {
  const lines = [];
  const logger = createLogger({ ...options, write: (line, level) => lines.push({ line, level }) });
  return { lines, logger };
}

describe("createLogger", () => {
  it("writes readable lines with the fields appended", () => {
    const { logger, lines } = capture({ level: "info" });
    logger.info("Inquiry delivered", { id: "a3f91c2e" });
    logger.warn("Careful");

    assert.match(lines[0].line, /^\d\d:\d\d:\d\d INFO  Inquiry delivered {"id":"a3f91c2e"}$/);
    assert.match(lines[1].line, /^\d\d:\d\d:\d\d WARN  Careful$/);
  });

  it("writes one JSON object per line in json mode", () => {
    const { logger, lines } = capture({ level: "info", json: true });
    logger.warn("Sending failed", { code: "ETIMEDOUT", attempt: 1 });

    const entry = JSON.parse(lines[0].line);
    assert.equal(entry.level, "warn");
    assert.equal(entry.message, "Sending failed");
    assert.equal(entry.code, "ETIMEDOUT");
    assert.equal(entry.attempt, 1);
    assert.ok(!Number.isNaN(Date.parse(entry.time)));
    assert.equal(lines[0].level, "warn");
  });

  it("hides messages below the chosen level", () => {
    const { logger, lines } = capture({ level: "warn" });
    logger.debug("a");
    logger.info("b");
    logger.warn("c");
    logger.error("d");
    assert.deepEqual(
      lines.map((entry) => entry.level),
      ["warn", "error"],
    );
  });

  it("shows everything at debug and nothing when silent", () => {
    const loud = capture({ level: "debug" });
    for (const level of ["debug", "info", "warn", "error"]) loud.logger[level]("x");
    assert.equal(loud.lines.length, 4);

    const quiet = capture({ level: "silent" });
    for (const level of ["debug", "info", "warn", "error"]) quiet.logger[level]("x");
    assert.equal(quiet.lines.length, 0);
  });

  it("sends warnings and errors to stderr and the rest to stdout by default", () => {
    const out = mock.method(console, "log", () => {});
    const err = mock.method(console, "error", () => {});
    try {
      const logger = createLogger({ level: "debug" });
      logger.info("one");
      logger.warn("two");
      logger.error("three");
      assert.equal(out.mock.callCount(), 1);
      assert.equal(err.mock.callCount(), 2);
    } finally {
      out.mock.restore();
      err.mock.restore();
    }
  });
});
