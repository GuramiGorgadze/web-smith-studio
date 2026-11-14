// A tiny HTML builder that escapes everything by default.
//
//   html`<p>${visitorText}</p>`      visitorText is escaped automatically
//   html`<p>${html`<b>ok</b>`}</p>`   the result of html`` is trusted and inserted as it is
//   raw("&nbsp;")                    explicitly trusted markup (constants only, never visitor text)
//
// Because escaping is the default, a forgotten call can never turn into HTML injection in an email.

class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text for use in element content or in a quoted attribute. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

/** Marks a string as trusted markup. Use it for constants only. */
export function raw(value) {
  return new SafeHtml(String(value));
}

function render(value) {
  if (value === null || value === undefined || value === false) return "";
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  return escapeHtml(value);
}

/** Template tag: static parts are trusted, every interpolated value is escaped unless it is SafeHtml. */
export function html(strings, ...values) {
  let output = strings[0];
  for (let index = 0; index < values.length; index += 1) {
    output += render(values[index]) + strings[index + 1];
  }
  return new SafeHtml(output);
}

/** Escapes text and turns line breaks into <br> so a message keeps its shape. */
export function nl2br(text) {
  return raw(
    String(text)
      .split("\n")
      .map((line) => escapeHtml(line))
      .join("<br>"),
  );
}

/** Builds the value of a style="" attribute from an object. Values are trusted constants. */
export function css(rules) {
  return raw(
    Object.entries(rules)
      .filter(([, value]) => value !== undefined && value !== null && value !== false)
      .map(([property, value]) => `${property}:${value}`)
      .join(";"),
  );
}

/** Turns a SafeHtml (or anything) into a plain string. */
export function toString(value) {
  return String(value);
}
