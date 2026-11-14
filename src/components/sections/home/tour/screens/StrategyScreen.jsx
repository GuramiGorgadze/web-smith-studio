import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import kit from "./ScreenKit.module.scss";
import styles from "./StrategyScreen.module.scss";

function Node({ children, accent = false, small = false }) {
  return <span className={cn(styles.node, accent && styles.accent, small && styles.small)}>{children}</span>;
}

/** Step 2: the sitemap, drawn as a horizontal tree. */
export function StrategyScreen() {
  const text = useContent().process.screens.strategy;

  return (
    <div className={cn(kit.canvas, styles.layout)}>
      <div className={cn(kit.panel, styles.map)}>
        <span className={kit.label}>{text.mapLabel}</span>
        <ul className={cn(styles.tree, styles.root)}>
          <li>
            <Node accent>{text.home}</Node>
            <ul className={styles.tree}>
              {text.pages.map((page) => (
                <li key={page.name}>
                  <Node>{page.name}</Node>
                  {page.children ? (
                    <ul className={styles.tree}>
                      {page.children.map((child) => (
                        <li key={child}>
                          <Node small>{child}</Node>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <aside className={cn(kit.panel, styles.notes)}>
        <span className={kit.label}>{text.jobsLabel}</span>
        {text.jobs.map((item) => (
          <div key={item.page} className={styles.job}>
            <span className={kit.strong}>{item.page}</span>
            <span className={kit.text}>{item.job}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}
