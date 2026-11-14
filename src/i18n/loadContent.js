// One lazy chunk per language: a visitor only downloads the copy they read.
// A language shows up here by having a folder src/content/<code>/index.js.
const modules = import.meta.glob("/src/content/*/index.js");

export async function loadContent(locale) {
  const load = modules[`/src/content/${locale}/index.js`];
  if (!load) throw new Error(`There is no content for the language "${locale}" (src/content/${locale}/index.js).`);
  return (await load()).default;
}
