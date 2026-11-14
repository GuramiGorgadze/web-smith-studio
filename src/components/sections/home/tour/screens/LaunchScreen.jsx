import { Check } from "lucide-react";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./LaunchScreen.module.scss";

/** Step 5: the launch checklist and the first activity after going live. */
export function LaunchScreen() {
  const text = useContent().process.screens.launch;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={cn(kit.panel, styles.checks)}>
        <div className={cn(kit.row, kit.spread)}>
          <span className={kit.label}>{text.checklistLabel}</span>
          <span className={cn(kit.label, kit.mono)}>{text.checklist.length} / {text.checklist.length}</span>
        </div>
        <ul className={styles.list}>
          {text.checklist.map((item) => (
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
      </div>

      <aside className={cn(kit.panel, styles.live)}>
        <div className={styles.status}>
          <span className={styles.pulse} />
          <span className={styles.liveText}>{text.live}</span>
        </div>
        <span className={cn(kit.text, kit.mono)}>{text.domain}</span>
        <ul className={styles.events}>
          {text.events.map((event) => (
            <li key={event.label} className={styles.event}>
              <span className={kit.strong}>{event.label}</span>
              <span className={kit.label}>{event.time}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
