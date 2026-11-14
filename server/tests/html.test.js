import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { css, escapeHtml, html, nl2br, raw } from "../src/mail/html.js";

describe("html template tag", () => {
  it("escapes interpolated text", () => {
    const value = `<script>alert("x")</script> & 'y'`;
    assert.equal(String(html`<p>${value}</p>`), "<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;</p>");
  });

  it("leaves trusted html() results and raw() markup alone", () => {
    const inner = html`<b>${"a < b"}</b>`;
    assert.equal(String(html`<p>${inner}${raw("&nbsp;")}</p>`), "<p><b>a &lt; b</b>&nbsp;</p>");
  });

  it("renders arrays, skips null, undefined and false, keeps zero", () => {
    assert.equal(String(html`${["<", html`<i>x</i>`]}|${null}|${undefined}|${false}|${0}`), "&lt;<i>x</i>||||0");
  });

  it("escapes attribute values", () => {
    const evil = `" onmouseover="alert(1)`;
    assert.equal(String(html`<a href="${evil}">x</a>`), `<a href="&quot; onmouseover=&quot;alert(1)">x</a>`);
  });
});

describe("helpers", () => {
  it("escapeHtml handles every special character", () => {
    assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  });

  it("nl2br escapes each line and joins with <br>", () => {
    assert.equal(String(nl2br("a <b>\nc & d")), "a &lt;b&gt;<br>c &amp; d");
  });

  it("css builds a style value and skips empty rules", () => {
    assert.equal(String(css({ color: "red", margin: undefined, padding: false, "font-size": "16px" })), "color:red;font-size:16px");
  });
});
