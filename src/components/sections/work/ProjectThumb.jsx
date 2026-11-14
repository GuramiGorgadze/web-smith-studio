import { useContent, useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./ProjectThumb.module.scss";

function Copy({ lines = [92, 66], paragraph = true, buttons = true }) {
  return (
    <div className={styles.copy}>
      <span className={styles.kicker} />
      {lines.map((width, index) => (
        <span key={index} className={styles.heading} style={{ width: `${width}%` }} />
      ))}
      {paragraph ? (
        <>
          <span className={styles.line} />
          <span className={styles.line} style={{ width: "58%" }} />
        </>
      ) : null}
      {buttons ? (
        <div className={styles.buttons}>
          <span className={styles.button} />
          <span className={styles.buttonGhost} />
        </div>
      ) : null}
    </div>
  );
}

function CafeLayout() {
  return (
    <>
      <Copy lines={[94, 72]} />
      <div className={styles.cafeArt}>
        <span className={styles.plate} />
        <span className={styles.plateInner} />
        <span className={styles.bean} />
        <span className={styles.beanSmall} />
      </div>
    </>
  );
}

function ClinicLayout() {
  return (
    <>
      <div className={styles.centered}>
        <span className={styles.kicker} />
        <span className={styles.heading} style={{ width: "74%" }} />
        <span className={styles.heading} style={{ width: "46%" }} />
        <div className={styles.bookBar}>
          <span />
          <span />
          <span />
          <i />
        </div>
      </div>
      <div className={styles.cards3}>
        {[0, 1, 2].map((index) => (
          <div key={index} className={styles.card}>
            <span className={styles.iconDot} />
            <span className={styles.bar} />
            <span className={styles.bar} style={{ width: "55%" }} />
          </div>
        ))}
      </div>
    </>
  );
}

function StoreLayout() {
  return (
    <>
      <div className={styles.storeHead}>
        <span className={styles.heading} style={{ width: "34%", marginBottom: 0 }} />
        <span className={styles.pill} />
      </div>
      <div className={styles.products}>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={styles.product}>
            <span className={styles.productImage} data-variant={index} />
            <span className={styles.bar} />
            <span className={styles.bar} style={{ width: "50%" }} />
          </div>
        ))}
      </div>
    </>
  );
}

function CorporateLayout() {
  return (
    <>
      <Copy lines={[96, 84, 52]} />
      <div className={styles.corpArt}>
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
          <path d="M14 98 C 50 30, 96 118, 132 56 S 180 24, 188 22" className={styles.route} />
          <circle cx="14" cy="98" r="5" className={styles.node} />
          <circle cx="104" cy="82" r="4" className={styles.node} />
          <circle cx="188" cy="22" r="6" className={styles.nodeAccent} />
        </svg>
        <div className={styles.statFloat}>
          <b />
          <span />
        </div>
      </div>
    </>
  );
}

function StudioLayout() {
  const rows = [78, 62, 90, 54];
  return (
    <>
      <Copy lines={[90, 60]} />
      <div className={styles.timetable}>
        {rows.map((width, index) => (
          <div key={index} className={styles.slot}>
            <span className={styles.time} />
            <span className={styles.slotBar} style={{ width: `${width}%` }} />
            <span className={styles.slotPill} data-active={index === 1} />
          </div>
        ))}
      </div>
    </>
  );
}

function FintechLayout() {
  return (
    <>
      <Copy lines={[88, 64]} />
      <div className={styles.dash}>
        <div className={styles.dashTop}>
          <span />
          <span />
          <span />
        </div>
        <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 62 C 24 58, 36 30, 62 36 S 104 64, 128 38 S 176 12, 200 8 L200 80 L0 80 Z" className={styles.area} />
          <path d="M0 62 C 24 58, 36 30, 62 36 S 104 64, 128 38 S 176 12, 200 8" className={styles.chartLine} />
        </svg>
        <div className={styles.dashStats}>
          <i />
          <i />
          <i />
        </div>
      </div>
    </>
  );
}

const layouts = {
  cafe: CafeLayout,
  clinic: ClinicLayout,
  store: StoreLayout,
  corporate: CorporateLayout,
  studio: StudioLayout,
  fintech: FintechLayout,
};

/**
 * A pure-CSS illustration of a project's website. Everything is sized in container-query units,
 * so the picture scales perfectly from a small card to a full-width case-study header.
 */
export function ProjectThumb({ project, className }) {
  const { t } = useI18n();
  const text = useContent().sections.work;
  const { palette, layout } = project;
  const Layout = layouts[layout] ?? CafeLayout;

  return (
    <div
      className={cn(styles.thumb, className)}
      role="img"
      aria-label={t(text.thumbLabel, { project: project.name })}
      style={{
        "--p-bg": palette.bg,
        "--p-surface": palette.surface,
        "--p-text": palette.text,
        "--p-accent": palette.accent,
        "--p-accent2": palette.accent2,
      }}
    >
      <div className={styles.nav} aria-hidden="true">
        <span className={styles.brand} />
        <span className={styles.navLinks}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.navCta} />
      </div>
      <div className={cn(styles.stage, styles[layout])} aria-hidden="true">
        <Layout />
      </div>
    </div>
  );
}
