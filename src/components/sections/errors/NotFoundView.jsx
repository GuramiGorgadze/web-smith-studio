import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Container } from "@/components/common/Container";
import { GradientText } from "@/components/common/GradientText";
import { Seo } from "@/components/layout/Seo";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import styles from "./NotFoundView.module.scss";

/** Friendly "not found" screen. Also used when a project slug does not exist (pass its own title and description). */
export function NotFoundView({ title, description }) {
  const { content, ui } = useI18n();
  const text = ui.notFound;

  return (
    <section className={styles.wrap} aria-labelledby="not-found-title">
      <Seo title={text.seoTitle} noindex />
      <BackdropGlow variant="hero" />
      <Container size="narrow" className={styles.inner}>
        <p className={styles.code} aria-hidden="true">
          <GradientText>404</GradientText>
        </p>
        <h1 id="not-found-title" className={styles.title}>
          {title ?? text.title}
        </h1>
        <p className={styles.text}>{description ?? text.text}</p>

        <div className={styles.actions}>
          <ButtonLink to="/" size="lg">
            {text.home}
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline" size="lg">
            {text.contact}
          </ButtonLink>
        </div>

        <nav className={styles.links} aria-label={text.popular}>
          {content.navigation.primary.map((item) => (
            <Link key={item.to} to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
