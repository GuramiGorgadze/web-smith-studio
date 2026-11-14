import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { FinalCta } from "@/components/sections/cta/FinalCta";
import { NotFoundView } from "@/components/sections/errors/NotFoundView";
import { NextProject } from "@/components/sections/work/NextProject";
import { ProjectBody } from "@/components/sections/work/ProjectBody";
import { ProjectHero } from "@/components/sections/work/ProjectHero";
import { useI18n } from "@/i18n/I18nContext";
import { breadcrumbJsonLd } from "@/lib/structuredData";

/** One project in detail. Unknown slugs fall back to the not-found screen. */
export default function WorkDetailPage() {
  const { slug } = useParams();
  const i18n = useI18n();
  const { t, ui, content } = i18n;
  const { items } = content.projects;
  const project = items.find((item) => item.slug === slug);

  if (!project) {
    return <NotFoundView title={ui.notFound.projectTitle} description={ui.notFound.projectText} />;
  }

  const next = items[(items.indexOf(project) + 1) % items.length];
  const path = `/work/${project.slug}`;

  return (
    <>
      <Seo
        title={project.isConcept ? t(content.pages.project.conceptTitle, { project: project.name }) : project.name}
        description={`${project.tagline} ${project.summary}`}
        path={path}
        jsonLd={breadcrumbJsonLd(i18n, [
          { name: content.pages.work.seoTitle, path: "/work" },
          { name: project.name, path },
        ])}
      />
      <ProjectHero project={project} />
      <ProjectBody project={project} />
      <NextProject project={next} />
      <FinalCta variant="project" showSteps={false} />
    </>
  );
}
