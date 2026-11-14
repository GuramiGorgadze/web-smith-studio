import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { displayName, maskEmail, maskEmailsIn, multiLine, safeFirstName, singleLine, truncate } from "../src/lib/text.js";

const char = (code) => String.fromCharCode(code);

describe("singleLine", () => {
  it("collapses whitespace and removes line breaks", () => {
    assert.equal(singleLine("  Ana \n\r\t  Smith  "), "Ana Smith");
  });

  it("removes control characters, so nothing can break out of an email header", () => {
    assert.equal(singleLine(`Ana${char(0)}${char(7)}${char(13)}${char(10)}Bcc: evil@example.com`), "Ana Bcc: evil@example.com");
  });

  it("removes hidden direction overrides and zero-width characters", () => {
    assert.equal(singleLine(`A${char(0x202e)}na${char(0x200b)} Sm${char(0xfeff)}ith`), "Ana Smith");
  });

  it("keeps Georgian and accented letters", () => {
    assert.equal(singleLine("ნინო  გელაშვილი"), "ნინო გელაშვილი");
    assert.equal(singleLine("Zoë"), "Zoë");
  });

  it("turns nothing into an empty string", () => {
    assert.equal(singleLine(undefined), "");
    assert.equal(singleLine(null), "");
  });
});

describe("multiLine", () => {
  it("keeps paragraphs but limits blank lines to one", () => {
    assert.equal(multiLine("One\n\n\n\n\nTwo"), "One\n\nTwo");
  });

  it("normalizes Windows line endings and strips trailing spaces", () => {
    assert.equal(multiLine("One   \r\nTwo"), "One\nTwo");
  });

  it("drops control and invisible characters but keeps tabs and line feeds", () => {
    assert.equal(multiLine(`a${char(0)}b${char(0x202e)}c\td\ne`), "abc\td\ne");
  });

  it("treats Unicode line separators as line breaks", () => {
    assert.equal(multiLine(`one${char(0x2028)}two`), "one\ntwo");
  });
});

describe("safeFirstName", () => {
  it("returns the first word of a plain name", () => {
    assert.equal(safeFirstName("Ana Smith"), "Ana");
    assert.equal(safeFirstName("ნინო გელაშვილი"), "ნინო");
    assert.equal(safeFirstName("Zoë O'Brien"), "Zoë");
    assert.equal(safeFirstName("Anne-Marie Dupont"), "Anne-Marie");
  });

  it("refuses anything that could carry a link or an address", () => {
    assert.equal(safeFirstName("evil.com"), "");
    assert.equal(safeFirstName("http://evil.example"), "");
    assert.equal(safeFirstName("win$1000 now"), "");
    assert.equal(safeFirstName("a@b.co"), "");
    assert.equal(safeFirstName("<b>Ana</b>"), "");
  });

  it("refuses very long words", () => {
    assert.equal(safeFirstName("A".repeat(41)), "");
  });
});

describe("displayName", () => {
  it("keeps ordinary names, including Georgian ones", () => {
    assert.equal(displayName("Ana Smith"), "Ana Smith");
    assert.equal(displayName("ნინო გელაშვილი"), "ნინო გელაშვილი");
    assert.equal(displayName("Zoë O'Brien-Smith"), "Zoë O'Brien-Smith");
  });

  it("removes characters that could make a name look like a second address", () => {
    assert.equal(displayName("Boss <ceo@bank.com>"), "Boss ceo bank.com");
    assert.equal(displayName('"Quoted" \\ name'), "Quoted name");
  });

  it("returns an empty string for nothing usable", () => {
    assert.equal(displayName("<>"), "");
    assert.equal(displayName(undefined), "");
  });
});

describe("maskEmail and truncate", () => {
  it("masks the local part", () => {
    assert.equal(maskEmail("ana@example.com"), "a***@example.com");
    assert.equal(maskEmail("not-an-email"), "***");
  });

  it("masks addresses inside longer text, such as an SMTP error", () => {
    assert.equal(
      maskEmailsIn("550 5.1.1 <ana@example.com>: Recipient address rejected for nino+x@example.ge."),
      "550 5.1.1 <a***@example.com>: Recipient address rejected for n***@example.ge.",
    );
    assert.equal(maskEmailsIn("Connection timed out"), "Connection timed out");
    assert.equal(maskEmailsIn(undefined), "");
  });

  it("truncates by character and adds an ellipsis", () => {
    assert.equal(truncate("abcdef", 4), "abc…");
    assert.equal(truncate("abc", 4), "abc");
    assert.equal(truncate("ნინოგელა", 5), "ნინო…");
  });
});
