// WCAG contrast maths, used by the tests to prove every text and background pair in the emails is readable.

/** "#3a3dfb" or "#fff" to [58, 61, 251]. */
export function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? [...value].map((character) => character + character).join("") : value;
  return [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16));
}

function channel(value) {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a hex color, 0 (black) to 1 (white). */
export function luminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** Contrast ratio between two hex colors, 1 to 21. Text needs at least 4.5. */
export function contrastRatio(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}
