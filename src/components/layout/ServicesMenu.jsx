import { ArrowRight } from "lucide-react";
import { IconTile } from "@/components/common/IconTile";
import { NavigationMenuLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./ServicesMenu.module.scss";

/** Content of the "Services" dropdown in the desktop navigation. */
export function ServicesMenu({ items }) {
  const { ui } = useI18n();

  return (
    <div className={styles.menu}>
      <ul className={styles.grid}>
        {items.map((service) => (
          <li key={service.slug}>
            <NavigationMenuLink asChild unstyled>
              <Link to={`/services#${service.slug}`} className={styles.item}>
                <IconTile name={service.icon} size={20} className={styles.tile} />
                <span className={styles.text}>
                  <span className={styles.title}>{service.title}</span>
                  <span className={styles.summary}>{service.summary}</span>
                </span>
              </Link>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span>{ui.servicesMenu.prompt}</span>
        <NavigationMenuLink asChild unstyled>
          <Link to="/contact" className={styles.footerLink}>
            {ui.servicesMenu.link}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}
