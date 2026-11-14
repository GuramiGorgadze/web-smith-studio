import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./Button";
import styles from "./Button.module.scss";

/**
 * A link that looks like a Button. Pass `to` for in-app routes (including `/#hash` anchors; the current
 * language is added for you) or `href` for external and mailto links, and for screens that have no
 * language context (src/routes/RouteError.jsx).
 */
export function ButtonLink({ to, href, variant, size, className, iconRight, children, external, ...props }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const icon = iconRight ? (
    <span className={styles.iconRight} aria-hidden="true">
      {iconRight}
    </span>
  ) : null;

  if (to) {
    return (
      <Link to={to} className={classes} data-slot="button" {...props}>
        {children}
        {icon}
      </Link>
    );
  }

  const isExternal = external ?? /^https?:\/\//.test(href ?? "");

  return (
    <a
      href={href}
      className={classes}
      data-slot="button"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {icon}
    </a>
  );
}
