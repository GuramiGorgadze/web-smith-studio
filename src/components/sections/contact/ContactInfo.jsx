import { Copy, ExternalLink, Mail } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import styles from "./ContactInfo.module.scss";

/** Sidebar next to the form: direct email, what happens next, and where else to find us. */
export function ContactInfo() {
  const { t, site, ui } = useI18n();
  const { contact } = useContent();
  const text = contact.info;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      toast.success(text.copied, { description: site.email });
    } catch {
      // Clipboard access can be blocked (older browsers, insecure pages). The address is visible, so nothing is lost.
      toast.error(text.copyFailed, { description: t(text.copyFailedHint) });
    }
  }

  return (
    <div className={styles.info} role="group" aria-label={text.aria}>
      <section className={styles.card} aria-labelledby="contact-direct-title">
        <Badge variant="success" dot>
          {site.availability}
        </Badge>

        <h2 id="contact-direct-title" className={styles.title}>
          {text.directTitle}
        </h2>
        <p className={styles.text}>{text.directText}</p>

        <a href={`mailto:${site.email}`} className={styles.email}>
          <Mail size={18} aria-hidden="true" />
          <span>{site.email}</span>
        </a>

        <Button type="button" variant="outline" size="sm" onClick={copyEmail} className={styles.copy}>
          <Copy size={14} aria-hidden="true" />
          {text.copy}
        </Button>
      </section>

      <section className={styles.card} aria-labelledby="contact-next-title">
        <h2 id="contact-next-title" className={styles.title}>
          {text.nextTitle}
        </h2>
        <ol className={styles.steps}>
          {contact.nextSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.text}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.links} aria-labelledby="contact-social-title">
        <h2 id="contact-social-title" className={styles.linksTitle}>
          {text.findTitle}
        </h2>
        <ul className={styles.linkList}>
          {site.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className={styles.link}>
                {social.label}
                <ExternalLink size={13} aria-hidden="true" />
                <span className="srOnly">{ui.newTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
