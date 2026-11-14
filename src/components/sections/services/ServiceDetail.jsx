import { ArrowRight } from "lucide-react";
import { CheckList } from "@/components/common/CheckList";
import { Eyebrow } from "@/components/common/Eyebrow";
import { IconTile } from "@/components/common/IconTile";
import { Reveal } from "@/components/common/Reveal";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { Icon } from "@/components/icons/Icon";
import { ButtonLink } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import { formatUSD } from "@/lib/format";
import styles from "./ServiceDetail.module.scss";

/**
 * One service: the story on one side, a quick-facts card on the other.
 * The id matches the service slug, so `/services#online-stores` (and the navbar menu) lands here.
 */
export function ServiceDetail({ service, index }) {
  const { ui } = useI18n();
  const text = useContent().sections.serviceDetail;

  const titleId = `${service.slug}-title`;
  const params = new URLSearchParams({ type: service.contactType });

  return (
    <article id={service.slug} className={cn(styles.detail, index % 2 === 1 && styles.reversed)} aria-labelledby={titleId}>
      <Reveal className={styles.copy}>
        <div className={styles.head}>
          <IconTile name={service.icon} />
          <Eyebrow dot={false}>{service.eyebrow}</Eyebrow>
        </div>
        <h2 id={titleId} className={styles.title}>
          {service.title}
        </h2>
        <p className={styles.description}>{service.description}</p>
        <CheckList items={service.bullets} className={styles.bullets} />
      </Reveal>

      <Reveal delay={120} className={styles.aside}>
        <SpotlightCard className={styles.card}>
          <Icon name={service.icon} size={168} strokeWidth={1} className={styles.watermark} />

          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{text.idealFor}</dt>
              <dd className={styles.factValue}>{service.idealFor}</dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{text.startingAt}</dt>
              <dd className={styles.price}>
                <span className="tabular">{formatUSD(service.from)}</span>
                {service.recurring === "monthly" ? <span className={styles.suffix}>{ui.prices.perMonth}</span> : null}
              </dd>
            </div>
          </dl>

          <ButtonLink to={`/contact?${params.toString()}`} iconRight={<ArrowRight size={16} />} className={styles.cta}>
            {text.cta}
          </ButtonLink>
        </SpotlightCard>
      </Reveal>
    </article>
  );
}
