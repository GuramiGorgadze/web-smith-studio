import { useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { ProjectCard } from "@/components/sections/work/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useContent } from "@/i18n/I18nContext";
import { cn } from "@/lib/cn";
import styles from "./WorkGrid.module.scss";

/** A responsive grid of project cards. A single project gets the whole row, picture and words side by side. */
function ProjectList({ items }) {
  const single = items.length === 1;

  return (
    <ul className={cn(styles.grid, single && styles.single)}>
      {items.map((project, index) => (
        <Reveal as="li" key={project.slug} delay={(index % 3) * 90}>
          <ProjectCard project={project} layout={single ? "wide" : "stack"} />
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Filter tabs (Radix) above the project cards. Only categories that have projects get a tab, and the tabs are
 * left out until there are at least two such categories: one filter would only repeat "All work".
 */
export function WorkGrid() {
  const { projects, sections } = useContent();
  const text = sections.work;
  const [category, setCategory] = useState("all");

  const projectsIn = (id) => (id === "all" ? projects.items : projects.items.filter((project) => project.category === id));
  const categories = projects.categories.filter((item) => item.id === "all" || projectsIn(item.id).length > 0);

  // Keeps the heading outline in order: the page title is an h1 and every card title is an h3.
  const heading = <h2 className="srOnly">{text.projectsHeading}</h2>;

  if (categories.length <= 2) {
    return (
      <>
        {heading}
        <ProjectList items={projects.items} />
      </>
    );
  }

  return (
    <Tabs value={category} onValueChange={setCategory}>
      {heading}
      <TabsList className={styles.list} aria-label={text.filterLabel}>
        {categories.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
            <span className={styles.count}>{projectsIn(item.id).length}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          <ProjectList items={projectsIn(item.id)} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
