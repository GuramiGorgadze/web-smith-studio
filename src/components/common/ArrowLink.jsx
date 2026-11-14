import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import styles from "./ArrowLink.module.scss";

/** Text link with a trailing arrow that nudges on hover. Use `to` for routes and `href` for external URLs. */
export function ArrowLink({ to, href, className, children, ...props }) {
  if (to) {
    return (
      <Link to={to} className={cn(styles.link, className)} {...props}>
        <span>{children}</span>
        <ArrowRight size={16} className={styles.icon} aria-hidden="true" />
      </Link>
    );
  }

  const external = /^https?:\/\//.test(href ?? "");

  return (
    <a
      href={href}
      className={cn(styles.link, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span>{children}</span>
      {external ? (
        <ArrowUpRight size={16} className={styles.icon} aria-hidden="true" />
      ) : (
        <ArrowRight size={16} className={styles.icon} aria-hidden="true" />
      )}
    </a>
  );
}
