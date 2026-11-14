import { Check } from "lucide-react";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./DiscoveryScreen.module.scss";

/** Step 1: the project brief form and the summary we play back. */
export function DiscoveryScreen() {
  const text = useContent().process.screens.discovery;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={cn(kit.panel, styles.form)}>
        <span className={kit.label}>{text.formLabel}</span>

        <div className={styles.field}>
          <span className={kit.text}>{text.goalQuestion}</span>
          <div className={kit.chipRow}>
            <span className={cn(kit.pill, kit.pillActive)}>{text.goals[0]}</span>
            <span className={kit.pill}>{text.goals[1]}</span>
            <span className={kit.pill}>{text.goals[2]}</span>
          </div>
        </div>

        <div className={styles.field}>
          <span className={kit.text}>{text.customerQuestion}</span>
          <span className={styles.input}>
            {text.customerAnswer}
            <i className={styles.caret} />
          </span>
        </div>

        <div className={styles.field}>
          <span className={kit.text}>{text.launchQuestion}</span>
          <div className={kit.chipRow}>
            <span className={kit.pill}>{text.launchOptions[0]}</span>
            <span className={cn(kit.pill, kit.pillActive)}>{text.launchOptions[1]}</span>
            <span className={kit.pill}>{text.launchOptions[2]}</span>
          </div>
        </div>
      </div>

      <aside className={cn(kit.panel, styles.summary)}>
        <span className={kit.label}>{text.summaryLabel}</span>
        <ul className={styles.list}>
          {text.summary.map((item) => (
            <li key={item} className={kit.row}>
              <span className={kit.check}>
                <Check strokeWidth={3} />
              </span>
              <span className={kit.strong}>{item}</span>
            </li>
          ))}
        </ul>
        <div className={styles.meter}>
          <span className={styles.meterFill} />
        </div>
        <span className={kit.text}>{text.done}</span>
      </aside>
    </div>
  );
}
