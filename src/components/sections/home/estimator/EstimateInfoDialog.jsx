import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { FEATURES, SITE_TYPES, surchargePercent, TIMELINES } from "@/lib/estimator";
import { formatUSD } from "@/lib/format";
import styles from "./EstimateInfoDialog.module.scss";

/** Explains, from the same data the estimator uses, how an estimate is put together. */
export function EstimateInfoDialog({ trigger }) {
  const { t, count, ui } = useI18n();
  const { sections, estimator: words } = useContent();
  const text = sections.estimatorTool.info;

  // The surcharge in the sentence comes from the same table the estimate is calculated with.
  const rush = TIMELINES.find((option) => option.multiplier > 1);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={styles.content} closeLabel={ui.close}>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{t(text.description, { percent: rush ? surchargePercent(rush) : 0 })}</DialogDescription>
        </DialogHeader>

        <div className={styles.group}>
          <h3 className={styles.heading}>{text.startingPrices}</h3>
          <ul className={styles.list}>
            {SITE_TYPES.map((type) => (
              <li key={type.id} className={styles.row}>
                <span>
                  {words.types[type.id].label}
                  <span className={styles.sub}>{count(text.included, type.pagesIncluded)}</span>
                </span>
                <span className={styles.price}>{formatUSD(type.base)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <h3 className={styles.heading}>{text.addOns}</h3>
          <ul className={styles.list}>
            {FEATURES.map((feature) => (
              <li key={feature.id} className={styles.row}>
                <span>{words.features[feature.id].label}</span>
                <span className={styles.price}>+{formatUSD(feature.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
