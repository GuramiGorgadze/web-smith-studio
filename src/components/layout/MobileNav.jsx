import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ThemeSegmented } from "@/components/layout/ThemeToggle";
import {
  ButtonLink,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./MobileNav.module.scss";

/** Slide-over navigation for screens below the desktop breakpoint (Radix Dialog under the hood). */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const { content, site, ui } = useI18n();
  const { primary, cta } = content.navigation;

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={styles.trigger} aria-label={ui.openMenu}>
          <Menu size={20} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent aria-describedby="mobile-nav-description" closeLabel={ui.closeMenu}>
        <SheetHeader>
          <SheetTitle>
            <Logo size={26} asLink={false} />
          </SheetTitle>
          <SheetDescription id="mobile-nav-description" className="srOnly">
            {ui.nav.siteNavigation}
          </SheetDescription>
        </SheetHeader>

        <nav className={styles.nav} aria-label={ui.nav.mobile}>
          <ul className={styles.list}>
            {primary.map((item) => (
              <li key={item.to}>
                <SheetClose asChild>
                  <Link to={item.to} className={styles.link}>
                    {item.label}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </SheetClose>
                {item.children ? (
                  <ul className={styles.sublist}>
                    {item.children.map((child) => (
                      <li key={child.slug}>
                        <SheetClose asChild>
                          <Link to={`/services#${child.slug}`} className={styles.sublink}>
                            {child.title}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          <div className={styles.preferences}>
            <LanguageSwitch variant="segmented" />
            <div className={styles.theme}>
              <ThemeSegmented />
            </div>
          </div>
          <SheetClose asChild>
            <ButtonLink to={cta.to} size="lg" iconRight={<ArrowRight size={18} />} className={styles.cta}>
              {cta.label}
            </ButtonLink>
          </SheetClose>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
