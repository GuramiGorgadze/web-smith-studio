import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { useContent } from "@/i18n/I18nContext";
import styles from "./StatsStrip.module.scss";

/** Three big numbers directly under the hero. */
export function StatsStrip() {
  const { stats, sections } = useContent();

  return (
    <section className={styles.strip} aria-label={sections.stats.label}>
      <Container size="default">
        <Reveal as="dl" className={styles.grid} delay={80}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.stat}>
              <dt className={styles.value}>
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dt>
              <dd className={styles.label}>{stat.label}</dd>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
