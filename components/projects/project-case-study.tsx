import type { ReactNode } from 'react';
import Link from 'next/link';
import { renderProjectMdx } from '@/lib/content/project-mdx';
import type { ProjectPresentation } from '@/lib/projects/presentation';
import type { ProjectRecord } from '@/types/content';

type ProjectCaseStudyProps = {
  project: ProjectRecord;
  presentation: ProjectPresentation;
  demo?: ReactNode;
  nextProject?: Pick<ProjectRecord, 'slug' | 'title'>;
};

export async function ProjectCaseStudy({ project, presentation, demo, nextProject }: ProjectCaseStudyProps) {
  const { content, sections } = await renderProjectMdx(project, demo);

  return (
    <article className="project-story">
      <div className="project-story-wrap">
        <header className="project-story-hero">
          <Link href="/projects" className="project-story-back">← All projects</Link>
          <p className="project-story-kicker">{project.tier} / {presentation.accentLabel}</p>
          <h1>{project.title}</h1>
          <p className="project-story-description">{project.description}</p>
          {project.technologies.length > 0 && (
            <ul className="project-story-stack" aria-label="Project technologies">
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          )}
        </header>
        <nav className="project-story-nav" aria-label="Case study sections">
          {sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="project-story-body">{content}</div>
        {nextProject && (
          <nav className="project-story-next" aria-label="Next project">
            <p className="project-story-kicker">Next project</p>
            <Link href={`/projects/${nextProject.slug}`}>{nextProject.title} <span aria-hidden="true">↗</span></Link>
          </nav>
        )}
      </div>
    </article>
  );
}
