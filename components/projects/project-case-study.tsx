import type { ReactNode } from 'react';
import Link from 'next/link';
import { renderProjectMdx } from '@/lib/content/project-mdx';
import type { ProjectPresentation } from '@/lib/projects/presentation';
import type { ProjectRecord } from '@/types/content';

type ProjectCaseStudyProps = {
  project: ProjectRecord;
  presentation: ProjectPresentation;
  demo?: ReactNode;
};

export async function ProjectCaseStudy({ project, presentation, demo }: ProjectCaseStudyProps) {
  const body = await renderProjectMdx(project, demo);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/projects"
        className="rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        All projects
      </Link>
      <p className="mt-8 text-sm font-medium tracking-[0.2em] text-muted-foreground">
        {project.tier.toUpperCase()} / {presentation.accentLabel}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.description}</p>
      <div className="mt-12">{body}</div>
    </article>
  );
}
