import { useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { ProjectCard } from "@/components/sections/work/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import styles from "./WorkGrid.module.scss";

/** Filter tabs (Radix) above a responsive grid of project cards. */
export function WorkGrid() {
  const { projects, sections } = useContent();
  const text = sections.work;
  const [category, setCategory] = useState("all");

  const projectsIn = (id) => (id === "all" ? projects.items : projects.items.filter((project) => project.category === id));

  return (
    <Tabs value={category} onValueChange={setCategory}>
      {/* Keeps the heading outline in order: the page title is an h1 and every card title is an h3. */}
      <h2 className="srOnly">{text.projectsHeading}</h2>
      <TabsList className={styles.list} aria-label={text.filterLabel}>
        {projects.categories.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
            <span className={styles.count}>{projectsIn(item.id).length}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {projects.categories.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          <ul className={styles.grid}>
            {projectsIn(item.id).map((project, index) => (
              <Reveal as="li" key={project.slug} delay={(index % 3) * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
