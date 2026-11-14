import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createWindowLimiter } from "../src/lib/windowLimiter.js";

function clock(start = 1_000_000) {
  let current = start;
  return { now: () => current, advance: (milliseconds) => (current += milliseconds) };
}

describe("createWindowLimiter", () => {
  it("allows up to max hits per window and then refuses", () => {
    const time = clock();
    const limiter = createWindowLimiter({ windowMs: 1000, max: 2, now: time.now });
    assert.equal(limiter.take("a"), true);
    assert.equal(limiter.take("a"), true);
    assert.equal(limiter.take("a"), false);
  });

  it("frees the key again once the window has passed", () => {
    const time = clock();
    const limiter = createWindowLimiter({ windowMs: 1000, max: 1, now: time.now });
    assert.equal(limiter.take("a"), true);
    assert.equal(limiter.take("a"), false);
    time.advance(1001);
    assert.equal(limiter.take("a"), true);
  });

  it("counts every key separately", () => {
    const time = clock();
    const limiter = createWindowLimiter({ windowMs: 1000, max: 1, now: time.now });
    assert.equal(limiter.take("a"), true);
    assert.equal(limiter.take("b"), true);
    assert.equal(limiter.take("a"), false);
  });

  it("stops tracking new keys when the table is full of recent ones, instead of growing", () => {
    const time = clock();
    const limiter = createWindowLimiter({ windowMs: 1000, max: 1, maxKeys: 2, now: time.now });
    assert.equal(limiter.take("a"), true);
    assert.equal(limiter.take("b"), true);
    assert.equal(limiter.take("c"), false);
    assert.equal(limiter.size(), 2);
    time.advance(2000);
    assert.equal(limiter.take("c"), true);
  });
});
