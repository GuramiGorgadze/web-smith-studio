import { LogoMark } from "@/components/brand/LogoMark";
import { site } from "@/data/site";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import styles from "./Logo.module.scss";

function LogoContent({ size, showWordmark }) {
  return (
    <>
      <LogoMark size={size} />
      {showWordmark ? (
        <span className={styles.wordmark} lang="en">
          <span className={styles.primary}>Web Smith</span>
          <span className={styles.secondary}>Studio</span>
        </span>
      ) : (
        <span className="srOnly" lang="en">{site.name}</span>
      )}
    </>
  );
}

function HomeLink({ className, onClick, children }) {
  const { ui, t } = useI18n();

  return (
    <Link to="/" className={className} aria-label={t(ui.logoHome)} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Mark + wordmark. Renders a home link by default (`asLink={false}` needs no language context). */
export function Logo({ size = 30, showWordmark = true, asLink = true, className, onClick }) {
  const content = <LogoContent size={size} showWordmark={showWordmark} />;

  if (!asLink) {
    return <span className={cn(styles.logo, className)}>{content}</span>;
  }

  return (
    <HomeLink className={cn(styles.logo, className)} onClick={onClick}>
      {content}
    </HomeLink>
  );
}
