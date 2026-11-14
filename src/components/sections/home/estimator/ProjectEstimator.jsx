import { useMemo, useState } from "react";
import { EstimateResult } from "@/components/sections/home/estimator/EstimateResult";
import { Label, Slider, Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { useContent, useI18n } from "@/i18n/I18nContext";
import { clampPages, DEFAULT_ESTIMATE_INPUT, estimateProject, FEATURES, getSiteType, SITE_TYPES } from "@/lib/estimator";
import { formatUSD } from "@/lib/format";
import styles from "./ProjectEstimator.module.scss";

/**
 * Interactive project estimator built from Radix toggle groups, a slider and switches.
 * Every number comes from src/lib/estimator.js (edit prices there) and every word from
 * src/content/<language>/ (sections.estimatorTool and estimator).
 */
export function ProjectEstimator({ initial = DEFAULT_ESTIMATE_INPUT, packagesTo }) {
  const { t, count } = useI18n();
  const { sections, estimator: words } = useContent();
  const text = sections.estimatorTool;

  const [input, setInput] = useState(initial);
  const type = getSiteType(input.type);
  const result = useMemo(() => estimateProject(input), [input]);
  const fixedPages = type.minPages === type.maxPages;

  const setType = (value) => {
    if (!value) return;
    const next = getSiteType(value);
    setInput((current) => ({ ...current, type: value, pages: clampPages(value, next.pagesIncluded + 1) }));
  };

  const setPages = ([value]) => setInput((current) => ({ ...current, pages: clampPages(current.type, value) }));

  const setFeature = (id, on) =>
    setInput((current) => ({
      ...current,
      features: on ? [...current.features, id] : current.features.filter((feature) => feature !== id),
    }));

  return (
    <div className={styles.layout}>
      <div className={styles.config}>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>
            <span className={styles.step}>1</span> {text.typeLegend}
          </legend>
          <ToggleGroup type="single" layout="cards" value={input.type} onValueChange={setType} aria-label={text.typeAria}>
            {SITE_TYPES.map((option) => (
              <ToggleGroupItem key={option.id} value={option.id}>
                <span className={styles.optionTitle}>{words.types[option.id].label}</span>
                <span className={styles.optionHint}>{words.types[option.id].blurb}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>
            <span className={styles.step}>2</span> {text.sizeLegend}
          </legend>
          <div className={styles.sliderRow}>
            <Label id="estimator-pages-label">{text.pagesLabel}</Label>
            <output className={styles.pages}>{count(words.pages, result.pages)}</output>
          </div>
          <Slider
            aria-labelledby="estimator-pages-label"
            min={type.minPages}
            max={type.maxPages}
            step={1}
            value={[result.pages]}
            onValueChange={setPages}
            disabled={fixedPages}
          />
          <p className={styles.help}>
            {fixedPages
              ? text.singlePage
              : t(text.pagesIncluded, { included: type.pagesIncluded, price: formatUSD(type.perExtraPage) })}
          </p>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>
            <span className={styles.step}>3</span> {text.extrasLegend}
          </legend>
          <ul className={styles.features}>
            {FEATURES.map((feature) => {
              const id = `estimator-feature-${feature.id}`;
              const label = words.features[feature.id];
              return (
                <li key={feature.id} className={styles.feature}>
                  <Switch
                    id={id}
                    checked={input.features.includes(feature.id)}
                    onCheckedChange={(on) => setFeature(feature.id, on)}
                  />
                  <Label htmlFor={id} className={styles.featureLabel}>
                    <span className={styles.featureName}>{label.label}</span>
                    <span className={styles.featureHint}>{label.hint}</span>
                  </Label>
                  <span className={styles.featurePrice}>+{formatUSD(feature.price)}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <div className={styles.result}>
        <EstimateResult input={input} result={result} packagesTo={packagesTo} />
      </div>
    </div>
  );
}
