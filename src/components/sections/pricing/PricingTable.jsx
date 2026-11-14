import { useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { PricingCard } from "@/components/sections/pricing/PricingCard";
import { Label, Switch } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { Rich } from "@/i18n/Rich";
import styles from "./PricingTable.module.scss";

/**
 * Three packages plus a switch that shows the optional monthly care plan on every card.
 * `estimatorTo` is where the footnote link goes; pages that contain the estimator pass "#estimator".
 */
export function PricingTable({ estimatorTo = "/#estimator" }) {
  const { pricing, sections } = useContent();
  const text = sections.pricingTable;
  const [withCare, setWithCare] = useState(false);

  return (
    <div className={styles.wrap}>
      <div className={styles.toggle}>
        <Switch id="pricing-care" checked={withCare} onCheckedChange={setWithCare} />
        <Label htmlFor="pricing-care" className={styles.toggleLabel}>
          <span className={styles.toggleTitle}>{text.careTitle}</span>
          <span className={styles.toggleNote}>{pricing.carePlanNote}</span>
        </Label>
      </div>

      <ul className={styles.grid}>
        {pricing.tiers.map((tier, index) => (
          <Reveal as="li" key={tier.id} delay={index * 90} className={styles.cell}>
            <PricingCard tier={tier} withCare={withCare} />
          </Reveal>
        ))}
      </ul>

      <p className={styles.footnote}>
        <Rich text={text.footnote} tags={{ estimator: (children) => <Link to={estimatorTo}>{children}</Link> }} />
      </p>
    </div>
  );
}
