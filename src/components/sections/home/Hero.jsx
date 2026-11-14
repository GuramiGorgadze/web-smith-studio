import { ArrowRight, Check } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { GradientText } from "@/components/common/GradientText";
import { Reveal } from "@/components/common/Reveal";
import { ButtonLink } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { Rich } from "@/i18n/Rich";
import styles from "./Hero.module.scss";

/** Home page hero: centered headline, calls to action, commitments and the brand mark as a soft watermark. */
export function Hero() {
  const { site, content, t } = useI18n();
  const text = content.sections.hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <BackdropGlow variant="hero" />

      <div className={styles.watermark} aria-hidden="true">
        <LogoMark size={560} />
      </div>

      <Container size="default" className={styles.inner}>
        <Reveal className={styles.copy}>
          <Eyebrow>{text.eyebrow}</Eyebrow>

          <h1 id="hero-title" className={styles.title}>
            {text.titleLead} <GradientText>{text.titleHighlight}</GradientText>
          </h1>

          <p className={styles.lead}>{t(text.lead)}</p>

          <div className={styles.actions}>
            <ButtonLink to="/contact" size="lg" iconRight={<ArrowRight size={18} />}>
              {text.primary}
            </ButtonLink>
            <ButtonLink to="/work" variant="outline" size="lg">
              {text.secondary}
            </ButtonLink>
          </div>

          <ul className={styles.promises}>
            {site.promises.map((promise) => (
              <li key={promise} className={styles.promise}>
                <Check size={15} strokeWidth={2.75} aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>

          <p className={styles.legal}>
            <Rich
              text={text.legal}
              tags={{
                terms: (children) => <Link to="/terms">{children}</Link>,
                privacy: (children) => <Link to="/privacy">{children}</Link>,
              }}
            />
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
