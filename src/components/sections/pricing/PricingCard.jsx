import { CheckList } from "@/components/common/CheckList";
import { Icon } from "@/components/icons/Icon";
import { Badge, ButtonLink } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import { formatUSD } from "@/lib/format";
import styles from "./PricingCard.module.scss";

/** One package. `withCare` highlights the optional monthly care plan and carries it to the contact form. */
export function PricingCard({ tier, withCare = false }) {
  const { t } = useI18n();
  const text = useContent().sections.pricingCard;

  const params = new URLSearchParams({ type: tier.type });
  if (withCare) params.set("care", "yes");

  const titleId = `tier-${tier.id}`;

  return (
    <article className={cn(styles.card, tier.featured && styles.featured)} aria-labelledby={titleId}>
      {tier.badge ? (
        <Badge variant="solid" className={styles.badge}>
          {tier.badge}
        </Badge>
      ) : null}

      <header className={styles.head}>
        <h3 id={titleId} className={styles.name}>
          {tier.name}
        </h3>
        <p className={styles.tagline}>{tier.tagline}</p>
      </header>

      {/* "from $1,200 one-time". A language that puts "from" after the number uses fromAfter instead of fromBefore. */}
      <p className={styles.price}>
        {text.fromBefore ? <span className={styles.from}>{text.fromBefore}</span> : null}
        <span className={styles.figure}>
          <span className={cn(styles.amount, "tabular")}>{formatUSD(tier.from)}</span>
          {text.fromAfter ? <span className={styles.from}>{text.fromAfter}</span> : null}
        </span>
        <span className={styles.unit}>{text.oneTime}</span>
      </p>

      <div className={cn(styles.care, withCare && styles.careOn)}>
        <span className={styles.careIcon}>
          <Icon name="lifebuoy" size={16} />
        </span>
        <span className={styles.careText}>
          <span className={styles.careLabel}>{withCare ? text.careIncluded : text.careOptional}</span>
          <span className={styles.careNote}>{t(text.carePerMonth, { price: formatUSD(tier.care) })}</span>
        </span>
      </div>

      <CheckList items={tier.features} className={styles.features} />

      <ButtonLink
        to={`/contact?${params.toString()}`}
        variant={tier.featured ? "default" : "outline"}
        size="lg"
        className={styles.cta}
      >
        {tier.cta}
      </ButtonLink>
    </article>
  );
}
