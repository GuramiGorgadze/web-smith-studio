import { Fragment } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { parseRich } from "@/i18n/text";

const defaultTags = {
  strong: (children) => <strong>{children}</strong>,
  em: (children) => <em>{children}</em>,
};

function render(parts, vars, tags, keyPrefix) {
  return parts.map((part, index) => {
    const key = `${keyPrefix}.${index}`;

    if (part.type === "text") return part.value;

    if (part.type === "var") {
      const value = vars[part.name];
      return <Fragment key={key}>{value == null ? `{${part.name}}` : value}</Fragment>;
    }

    const inner = render(parseRich(part.value), vars, tags, key);
    const wrap = tags[part.name] ?? defaultTags[part.name];
    return <Fragment key={key}>{wrap ? wrap(inner) : inner}</Fragment>;
  });
}

/**
 * Renders a translated sentence that contains values, links or emphasis:
 *
 *   <Rich text={ui.hero.legal} tags={{ terms: (c) => <Link to="/terms">{c}</Link> }} />
 *   with  legal: "By continuing, you agree to our <terms>Terms</terms>."
 *
 * `vars` fills {name} marks with text or elements. {name}, {email}, {responseTime} and {founded} are always available.
 * `<strong>` and `<em>` work without being passed in.
 */
export function Rich({ text, vars, tags = {} }) {
  const { baseVars } = useI18n();
  return <>{render(parseRich(text), { ...baseVars, ...vars }, tags, "r")}</>;
}
