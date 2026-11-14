/**
 * Small text helpers for translated strings. Plain JavaScript, so tests can import it.
 *
 * Strings use three kinds of marks, the same in every language:
 *   {name}               a value filled in by the code, for example "{count} pages"
 *   <tag>words</tag>     words the code wraps in an element, for example a link or <strong>
 *   {name} inside a tag  works too, so a link's text can carry a value
 * Putting the marks inside the sentence (instead of gluing sentences together in code) lets every
 * language put the link, the bold word or the number wherever its grammar wants it.
 */

/** Replaces {name} with vars.name. A name with no value is left as written, so a typo is easy to spot. */
export function format(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (whole, key) => (vars[key] == null ? whole : String(vars[key])));
}

/** Picks the plural form the language needs: `forms` is { one: "{count} page", other: "{count} pages" }. */
export function pluralize(locale, count, forms, vars = {}) {
  const category = new Intl.PluralRules(locale).select(count);
  return format(forms[category] ?? forms.other, { ...vars, count });
}

/**
 * Splits a string into text, {value} and <tag>…</tag> parts. Tags do not nest inside tags of the same
 * name, but a {value} inside a tag is fine (the renderer parses the tag's text again).
 */
export function parseRich(text) {
  const parts = [];
  const pattern = /<(\w+)>([\s\S]*?)<\/\1>|\{(\w+)\}/g;
  const source = String(text);
  let last = 0;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    if (match.index > last) parts.push({ type: "text", value: source.slice(last, match.index) });
    parts.push(match[1] ? { type: "tag", name: match[1], value: match[2] } : { type: "var", name: match[3] });
    last = pattern.lastIndex;
  }

  if (last < source.length) parts.push({ type: "text", value: source.slice(last) });
  return parts;
}

/** The {names} and <tags> a string uses, for the tests that compare one language with another. */
export function marksOf(text) {
  const source = String(text);
  const values = [...source.matchAll(/\{(\w+)\}/g)].map((match) => `{${match[1]}}`);
  const tags = [...source.matchAll(/<(\w+)>[\s\S]*?<\/\1>/g)].map((match) => `<${match[1]}>`);
  return [...new Set([...values, ...tags])].sort();
}
