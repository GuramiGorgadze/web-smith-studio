import { useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/common/Container";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { MobileNav } from "@/components/layout/MobileNav";
import { ServicesMenu } from "@/components/layout/ServicesMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  ButtonLink,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui";
import { useScrolled } from "@/hooks/useScrolled";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import styles from "./Navbar.module.scss";

// `current` is the page's address without the language ("/work/atelier-voss").
function isActive(item, current) {
  if (item.to.includes("#")) return false;
  return current === item.to || current.startsWith(`${item.to}/`);
}

/** Sticky top bar: logo, Radix navigation menu, language and theme switches, call to action and mobile sheet. */
export function Navbar() {
  const scrolled = useScrolled(8);
  const { pathname } = useLocation();
  const { content, ui, neutralPath } = useI18n();
  const { primary, cta } = content.navigation;
  const current = neutralPath(pathname);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <Container size="wide" className={styles.bar}>
        <Logo />

        <nav className={styles.desktop} aria-label={ui.nav.primary}>
          <NavigationMenu>
            <NavigationMenuList>
              {primary.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ServicesMenu items={item.children} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink asChild active={isActive(item, current)}>
                      <Link to={item.to}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch />
          <span className={styles.theme}>
            <ThemeToggle />
          </span>
          <ButtonLink to={cta.to} size="md" className={styles.cta}>
            {cta.label}
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
