import { TrendingUp } from "lucide-react";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./GrowthScreen.module.scss";

const linePath = "M0 78 C 22 74, 34 52, 58 56 S 96 80, 120 46 S 168 26, 196 30 S 232 12, 260 8";

/** Step 6: a sample insights dashboard with a monthly recommendation. */
export function GrowthScreen() {
  const text = useContent().process.screens.growth;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={styles.tiles}>
        {text.tiles.map((tile) => (
          <div key={tile.label} className={cn(kit.panel, styles.tile)}>
            <span className={kit.label}>{tile.label}</span>
            <span className={styles.value}>{tile.value}</span>
            <span className={styles.delta}>{tile.delta}</span>
          </div>
        ))}
      </div>

      <div className={cn(kit.panel, styles.chart)}>
        <div className={cn(kit.row, kit.spread)}>
          <span className={kit.label}>{text.chartLabel}</span>
          <span className={styles.trend}>
            <TrendingUp strokeWidth={2.25} />
            {text.trend}
          </span>
        </div>
        <svg viewBox="0 0 260 90" preserveAspectRatio="none" className={styles.svg} aria-hidden="true">
          {[22, 45, 68].map((y) => (
            <line key={y} x1="0" x2="260" y1={y} y2={y} className={styles.grid} />
          ))}
          <path d={`${linePath} L260 90 L0 90 Z`} className={styles.area} />
          <path d={linePath} className={styles.line} />
        </svg>
      </div>

      <div className={cn(kit.panel, kit.row, styles.tip)}>
        <span className={styles.tipBadge}>{text.tipBadge}</span>
        <span className={kit.text}>{text.tip}</span>
      </div>
    </div>
  );
}
