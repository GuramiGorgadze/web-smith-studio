import { Calculator, Plus, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/i18n/I18nContext";
import styles from "./EstimateAttachment.module.scss";

/**
 * Shown when the visitor arrives from the "Try it live" estimator. The estimate travels with their
 * message. One button toggles it off and on again, so it keeps keyboard focus when it is pressed.
 * `estimate` comes from describeEstimate(), so it is already written in the visitor's language.
 */
export function EstimateAttachment({ estimate, included, onToggle }) {
  const { t, content } = useI18n();
  const text = content.contact.attachment;

  return (
    <div className={styles.box} role="group" aria-label={text.aria} data-included={included}>
      <span className={styles.icon} aria-hidden="true">
        <Calculator size={18} />
      </span>

      <div className={styles.copy} aria-live="polite">
        {included ? (
          <>
            <p className={styles.title}>{text.included}</p>
            <p className={styles.headline}>{estimate.headline}</p>
            <p className={styles.details}>{estimate.features}.</p>
            <p className={styles.range}>
              <span className="tabular">{estimate.range}</span>
              <span className={styles.weeks}>{t(text.about, { weeks: estimate.weeks })}</span>
            </p>
          </>
        ) : (
          <>
            <p className={styles.title}>{text.removed}</p>
            <p className={styles.details}>{text.removedHint}</p>
          </>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={styles.toggle}
        aria-label={included ? text.removeLabel : text.addBackLabel}
      >
        {included ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
        {included ? text.remove : text.addBack}
      </Button>
    </div>
  );
}
