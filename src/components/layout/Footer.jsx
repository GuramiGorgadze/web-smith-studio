import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/common/Container";
// Georgian is switched off for now (src/i18n/locales.js), so there is no language switch.
// import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { Badge } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./Footer.module.scss";

function FooterLink({ link }) {
  const { t } = useI18n();

  if (link.to) {
    return (
      <Link to={link.to} className={styles.link}>
        {link.label}
      </Link>
    );
  }

  // {email} in a label or address is replaced with the studio's address.
  const href = t(link.href);
  const external = /^https?:\/\//.test(href);

  return (
    <a href={href} className={styles.link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {t(link.label)}
      {external ? <ArrowUpRight size={13} aria-hidden="true" /> : null}
    </a>
  );
}

export function Footer() {
  const { content, site, ui, t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="default" className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size={34} />
            <p className={styles.tagline}>{site.tagline}</p>
            <Badge variant="success" dot>
              {site.availability}
            </Badge>
            {/* <LanguageSwitch variant="segmented" className={styles.language} /> */}
          </div>

          <nav className={styles.columns} aria-label={ui.nav.footer}>
            {content.navigation.footerColumns.map((column) => {
              // The "find us" column lists the social links from src/data/site.js.
              const links = column.socials ? site.socials : column.links;

              return (
                <div key={column.title} className={styles.column}>
                  <h2 className={styles.columnTitle}>{column.title}</h2>
                  <ul className={styles.list}>
                    {links.map((link) => (
                      <li key={link.label}>
                        <FooterLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>{t(ui.footer.copyright, { year })}</p>
          <ul className={styles.legal}>
            {content.navigation.legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.note}>{site.workingModel}</p>
        </div>
      </Container>
    </footer>
  );
}
