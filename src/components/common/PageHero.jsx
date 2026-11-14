import { BackdropGlow } from "@/components/common/BackdropGlow";
import { Container } from "@/components/common/Container";
import { Eyebrow } from "@/components/common/Eyebrow";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/lib/cn";
import styles from "./PageHero.module.scss";

/** Hero block for inner pages. `children` renders below the actions (badges, meta rows, etc.). */
export function PageHero({ eyebrow, title, description, actions, children, align = "left", className }) {
  return (
    <header className={cn(styles.hero, styles[align], className)}>
      <BackdropGlow variant="hero" />
      <Container size="default">
        <Reveal className={styles.copy}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </Reveal>
        {children ? <Reveal delay={120}>{children}</Reveal> : null}
      </Container>
    </header>
  );
}
