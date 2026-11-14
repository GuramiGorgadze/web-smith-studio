import { useEffect, useRef } from "react";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/icons/Icon";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useContent } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { cn } from "@/lib/cn";
import styles from "./ServiceAnchorNav.module.scss";

/** Sticky row of jump links under the navbar. The link for the service on screen is highlighted. */
export function ServiceAnchorNav() {
  const { pages, services } = useContent();
  const itemsRef = useRef([]);

  // The articles are rendered by the page, so they are looked up once everything has mounted.
  useEffect(() => {
    itemsRef.current = services.map((service) => document.getElementById(service.slug));
  }, [services]);

  const [active] = useScrollSpy(itemsRef, services.length, { initial: -1 });

  return (
    <div className={styles.bar}>
      <Container>
        <nav className={styles.nav} aria-label={pages.services.jump}>
          {services.map((service, index) => (
            <Link
              key={service.slug}
              to={{ hash: `#${service.slug}` }}
              className={cn(styles.link, active === index && styles.active)}
              aria-current={active === index ? "location" : undefined}
            >
              <Icon name={service.icon} size={16} />
              {service.title}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
