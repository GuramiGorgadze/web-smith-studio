import { useSearchParams } from "react-router-dom";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { useContent } from "@/i18n/I18nContext";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import styles from "./ContactSection.module.scss";

/** The form card on the left and the sidebar on the right. */
export function ContactSection() {
  const [searchParams] = useSearchParams();
  const { pages } = useContent();

  return (
    <Section id="contact-form" spacing="tight" aria-label={pages.contact.sectionLabel}>
      <div className={styles.layout}>
        <Reveal className={styles.card}>
          {/* A new address (a different service button, say) starts a fresh, correctly prefilled form. */}
          <ContactForm key={searchParams.toString()} searchParams={searchParams} />
        </Reveal>

        <Reveal delay={120} className={styles.side}>
          <ContactInfo />
        </Reveal>
      </div>
    </Section>
  );
}
