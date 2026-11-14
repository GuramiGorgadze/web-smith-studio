import { Info } from "lucide-react";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./ConceptNotice.module.scss";

/** Honest label for concept work: the businesses are fictional and no client results are implied. */
export function ConceptNotice({ children, className }) {
  const text = useContent().sections.work;

  return (
    <div role="note" className={cn(styles.notice, className)} aria-label={text.conceptNoticeLabel}>
      <span className={styles.icon}>
        <Info size={18} aria-hidden="true" />
      </span>
      <p className={styles.text}>{children}</p>
    </div>
  );
}
