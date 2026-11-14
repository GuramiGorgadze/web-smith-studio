import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectCard } from "@/components/sections/work/ProjectCard";
import { ButtonLink } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import styles from "./WorkShowcase.module.scss";

const featuredSlugs = ["harbor-and-pine-cafe", "atelier-voss", "kestrel-logistics", "meridian-capital"];

/** Four featured projects on the home page. */
export function WorkShowcase() {
  const { projects, sections } = useContent();
  const text = sections.workShowcase;
  const featured = projects.items.filter((project) => featuredSlugs.includes(project.slug));

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

      <ul className={styles.grid}>
        {featured.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={(index % 2) * 100}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
