import { Link as RouterLink } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

/**
 * Adds the current language to a link target: "/contact" -> "/ka/contact" on the Georgian site.
 * Strings that are not site paths ("#estimator", "?type=store") and objects without a pathname are left alone.
 */
export function localizeTo(to, path) {
  if (typeof to === "string") return path(to);
  if (to && typeof to === "object" && typeof to.pathname === "string") return { ...to, pathname: path(to.pathname) };
  return to;
}

/** React Router's Link, but it keeps the visitor in their language. Use it for every link inside the site. */
export function Link({ to, ...props }) {
  const { path } = useI18n();
  return <RouterLink to={localizeTo(to, path)} {...props} />;
}
