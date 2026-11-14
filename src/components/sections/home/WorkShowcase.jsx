import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectCard } from "@/components/sections/work/ProjectCard";
import { ButtonLink } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./WorkShowcase.module.scss";

// The projects featured on the home page (up to four). A slug that is not in projects.js is skipped.
// The concept projects featured before are switched off:
// "harbor-and-pine-cafe", "atelier-voss", "kestrel-logistics", "meridian-capital"
const featuredSlugs = ["fitofarm-2024"];

/** Featured projects on the home page. A single project gets the whole row, picture and words side by side. */
export function WorkShowcase() {
  const { projects, sections } = useContent();
  const text = sections.workShowcase;
  const featured = projects.items.filter((project) => featuredSlugs.includes(project.slug));
  const single = featured.length === 1;

  return (
    <Section id="work" tone="muted" aria-labelledby="work-title">
      <Reveal>
        <SectionHeading
          eyebrow={text.eyebrow}
          titleId="work-title"
          title={text.title}
          description={text.description}
          actions={
            <ButtonLink to="/work" variant="outline" iconRight={<ArrowRight size={16} />}>
              {text.cta}
            </ButtonLink>
          }
        />
      </Reveal>

      <ul className={cn(styles.grid, single && styles.single)}>
        {featured.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={(index % 2) * 100}>
            <ProjectCard project={project} layout={single ? "wide" : "stack"} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
