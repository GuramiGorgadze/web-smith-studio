import { ArrowRight, Info } from "lucide-react";
import { EstimateInfoDialog } from "@/components/sections/home/estimator/EstimateInfoDialog";
import { Button, ButtonLink } from "@/components/ui";
import { useTween } from "@/hooks/useTween";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { Link } from "@/i18n/Link";
import { Rich } from "@/i18n/Rich";
import { estimateToSearchParams } from "@/lib/estimator";
import { formatUSD } from "@/lib/format";
import styles from "./EstimateResult.module.scss";

/**
 * Result panel of the estimator: price range, timeline, budget split and the next step.
 * `packagesTo` is where the "packages" link in the footnote goes (the pricing page itself uses "#packages").
 */
export function EstimateResult({ input, result, packagesTo = "/pricing" }) {
  const { t } = useI18n();
  const { sections, estimator: words } = useContent();
  const text = sections.estimatorTool.result;

  const low = useTween(result.low);
  const high = useTween(result.high);
  const total = result.breakdown.reduce((sum, part) => sum + part.value, 0) || 1;
  const quoteHref = `/contact?${estimateToSearchParams(input, result).toString()}`;
  const weeks = t(text.weeks, { low: result.weeksLow, high: result.weeksHigh });

  return (
    <div className={styles.panel} role="group" aria-labelledby="estimate-title">
      <div className={styles.head}>
        <span className={styles.label} id="estimate-title">
          {text.title}
        </span>
        <p className={styles.range} aria-hidden="true">
          <span className="tabular">{formatUSD(low)}</span>
          <span className={styles.dash}>{text.rangeDash}</span>
          <span className="tabular">{formatUSD(high)}</span>
        </p>
        {/* The animated figures above change every frame, so screen readers get the settled values instead. */}
        <p className="srOnly" aria-live="polite" aria-atomic="true">
          {t(text.announce, {
            low: formatUSD(result.low),
            high: formatUSD(result.high),
            weeksLow: result.weeksLow,
            weeksHigh: result.weeksHigh,
          })}
        </p>
        <p className={styles.time}>
          {text.typical} <strong>{weeks}</strong>
        </p>
      </div>

      <div className={styles.split}>
        <span className={styles.label}>{text.split}</span>
        <ul className={styles.bars}>
          {result.breakdown.map((part) => (
            <li key={part.id} className={styles.barRow}>
              <span className={styles.barLabel}>{words.breakdown[part.id]}</span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.fill} style={{ width: `${Math.max(2, (part.value / total) * 100)}%` }} />
              </span>
              <span className={styles.amount}>{formatUSD(Math.round(part.value / 50) * 50)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <ButtonLink to={quoteHref} size="lg" iconRight={<ArrowRight size={18} />} className={styles.cta}>
          {text.cta}
        </ButtonLink>
        <EstimateInfoDialog
          trigger={
            <Button variant="ghost" size="sm" className={styles.info}>
              <Info size={16} aria-hidden="true" />
              {text.how}
            </Button>
          }
        />
      </div>

      <p className={styles.note}>
        <Rich text={text.note} tags={{ packages: (children) => <Link to={packagesTo}>{children}</Link> }} />
      </p>
    </div>
  );
}
