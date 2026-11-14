import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./BuildScreen.module.scss";

// Each line is a list of [token class, text] pairs. `indent` is in levels of two spaces.
const code = [
  { indent: 0, parts: [["kw", "import"], ["pun", " { "], ["fn", "Hero"], ["pun", " } "], ["kw", "from"], ["str", ' "./sections"'], ["pun", ";"]] },
  { indent: 0, parts: [] },
  { indent: 0, parts: [["kw", "export default function"], ["fn", " Page"], ["pun", "() {"]] },
  { indent: 1, parts: [["kw", "return"], ["pun", " ("]] },
  { indent: 2, parts: [["tag", "<main>"]] },
  { indent: 3, parts: [["tag", "<Hero"], ["attr", " title"], ["pun", "="], ["str", '"Welcome"'], ["tag", " />"]] },
  { indent: 3, parts: [["tag", "<Services />"]] },
  { indent: 3, parts: [["tag", "<Contact />"]] },
  { indent: 2, parts: [["tag", "</main>"]] },
  { indent: 1, parts: [["pun", ");"]] },
  { indent: 0, parts: [["pun", "}"]] },
];

// The four audit scores, in the order of the labels in the content (performance, accessibility, best practices, SEO).
const scores = [98, 100, 100, 100];

function Ring({ label, value }) {
  return (
    <div className={styles.ring}>
      <svg viewBox="0 0 36 36" className={styles.svg} aria-hidden="true">
        <circle className={styles.track} cx="18" cy="18" r="15.9155" />
        <circle
          className={styles.progress}
          cx="18"
          cy="18"
          r="15.9155"
          strokeDasharray={`${value} 100`}
          pathLength="100"
        />
      </svg>
      <span className={styles.score}>{value}</span>
      <span className={styles.ringLabel}>{label}</span>
    </div>
  );
}

/** Step 4: source code on the left, an audit report on the right. */
export function BuildScreen() {
  const text = useContent().process.screens.build;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={cn(kit.panel, styles.editor)}>
        <div className={styles.tabs}>
          <span className={styles.tabActive}>{text.tabs[0]}</span>
          <span className={styles.tab}>{text.tabs[1]}</span>
        </div>
        <pre className={styles.code}>
          {code.map((line, index) => (
            <div key={index} className={styles.line}>
              <span className={styles.number}>{index + 1}</span>
              <span style={{ paddingLeft: `${line.indent * 2}ch` }}>
                {line.parts.map(([token, text], partIndex) => (
                  <span key={partIndex} className={styles[token]}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>

      <aside className={cn(kit.panel, styles.audit)}>
        <span className={kit.label}>{text.auditLabel}</span>
        <div className={styles.rings}>
          {text.scores.map((label, index) => (
            <Ring key={label} label={label} value={scores[index]} />
          ))}
        </div>
      </aside>
    </div>
  );
}
