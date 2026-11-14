import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { FloatingChip } from "@/components/common/FloatingChip";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { WindowFrame } from "@/components/common/WindowFrame";
import { TourScreen } from "@/components/sections/home/tour/screens";
import { ButtonLink } from "@/components/ui";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./ProcessTour.module.scss";

function StepStage({ step }) {
  const { content, t } = useI18n();

  return (
    <div className={styles.stage}>
      <WindowFrame
        url={step.url}
        label={t(content.sections.processTour.illustration, { number: step.number, title: step.title })}
      >
        <TourScreen key={step.id} screen={step.screen} />
      </WindowFrame>
      <div className={styles.chips} key={`${step.id}-chips`}>
        {step.chips.map((chip, index) => (
          <span key={chip} className={cn(styles.chipSlot, styles[`slot${index}`])} style={{ "--i": index }}>
            <FloatingChip style={{ "--chip-delay": `${index * 0.7}s` }}>{chip}</FloatingChip>
          </span>
        ))}
      </div>
    </div>
  );
}

function DesktopTour({ processSteps }) {
  const itemRefs = useRef([]);
  const [active, setActive] = useScrollSpy(itemRefs, processSteps.length);
  const step = processSteps[active];

  return (
    <div className={styles.tour}>
      <ol className={styles.steps}>
        {processSteps.map((item, index) => (
          <li
            key={item.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={cn(styles.step, index === active && styles.active)}
          >
            <button
              type="button"
              className={styles.stepButton}
              onClick={() => setActive(index)}
              aria-current={index === active ? "step" : undefined}
            >
              <span className={styles.number}>{item.number}</span>
              <span className={styles.stepBody}>
                <span className={styles.stepTitle}>{item.title}</span>
                <span className={styles.stepDescription}>{item.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.stageWrap}>
        <StepStage step={step} />
      </div>
    </div>
  );
}

function StackedTour({ processSteps }) {
  return (
    <ol className={styles.stacked}>
      {processSteps.map((item) => (
        <li key={item.id} className={styles.card}>
          <div className={styles.cardCopy}>
            <span className={styles.number}>{item.number}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.stepDescription}>{item.description}</p>
          </div>
          <StepStage step={item} />
        </li>
      ))}
    </ol>
  );
}

/**
 * "How we work": six steps beside a sticky illustrated browser window.
 * On large screens the active step follows the scroll position (and can be clicked);
 * on smaller screens every step is shown with its own illustration.
 */
export function ProcessTour() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { content } = useI18n();
  const text = content.sections.processTour;
  const steps = content.process.steps;

  return (
    <Section id="process" aria-labelledby="process-title">
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId="process-title"
          title={text.title}
          description={text.description}
          actions={
            <ButtonLink to="/contact" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.cta}
            </ButtonLink>
          }
        />
      </Reveal>

      {isDesktop ? <DesktopTour processSteps={steps} /> : <StackedTour processSteps={steps} />}
    </Section>
  );
}
