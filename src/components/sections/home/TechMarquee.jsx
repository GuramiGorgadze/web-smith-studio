import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Marquee } from "@/components/common/Marquee";
import { techStack } from "@/data/techStack";
import { useContent } from "@/i18n/I18nContext";
import styles from "./TechMarquee.module.scss";

/** Scrolling band listing the tools we build with. Tool names are the same in every language. */
export function TechMarquee() {
  const { sections } = useContent();
  const text = sections.techMarquee;

  return (
    <section className={styles.band} aria-labelledby="tech-title">
      <Container size="default" className={styles.head}>
        <Eyebrow as="h2" id="tech-title">
          {text.eyebrow}
        </Eyebrow>
      </Container>
      <Marquee items={techStack} label={text.label} />
    </section>
  );
}
