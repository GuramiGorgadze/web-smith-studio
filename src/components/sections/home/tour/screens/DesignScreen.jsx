import { LogoMark } from "@/components/brand/LogoMark";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./DesignScreen.module.scss";

const swatches = ["--brand-sky", "--brand-blue", "--brand-periwinkle", "--brand-lavender", "--brand-white"];

/** Step 3: a live design preview on desktop and phone, with the palette and type specimen. */
export function DesignScreen() {
  const text = useContent().process.screens.design;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={cn(kit.panel, styles.desktop)}>
        <div className={styles.siteNav}>
          <LogoMark size={22} />
          <span className={styles.navBars}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.navButton} />
        </div>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker} />
            <span className={styles.headline} style={{ width: "92%" }} />
            <span className={styles.headline} style={{ width: "64%" }} />
            <span className={kit.bar} style={{ width: "80%" }} />
            <span className={kit.bar} style={{ width: "58%" }} />
            <span className={styles.cta} />
          </div>
          <div className={styles.art}>
            <span className={styles.orb} />
            <span className={styles.orbSmall} />
          </div>
        </div>
      </div>

      <div className={styles.side}>
        <div className={cn(kit.panel, styles.phoneWrap)}>
          <div className={styles.phone}>
            <span className={styles.phoneNotch} />
            <span className={styles.kicker} style={{ width: "40%" }} />
            <span className={styles.headline} style={{ width: "88%" }} />
            <span className={styles.headline} style={{ width: "58%" }} />
            <span className={styles.cta} style={{ width: "52%" }} />
            <span className={styles.phoneCard} />
          </div>
        </div>

        <div className={cn(kit.panel, styles.tokens)}>
          <div className={styles.swatches}>
            {swatches.map((token) => (
              <span key={token} className={styles.swatch} style={{ background: `var(${token})` }} />
            ))}
          </div>
          <div className={kit.row}>
            <span className={styles.specimen}>{text.typeSpecimen}</span>
            <span className={kit.text}>{text.typeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
