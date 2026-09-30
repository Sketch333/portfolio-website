import Link from 'next/link';
import Image from 'next/image';
import { getProjectPresentation } from '@/lib/projects/presentation';
import type { ProjectRecord } from '@/types/content';

type ProjectCardProps = {
  project: ProjectRecord;
  variant: 'home' | 'index';
  ordinal?: number;
  lead?: boolean;
};

export function ProjectCard({ project, variant, ordinal, lead = false }: ProjectCardProps) {
  const presentation = getProjectPresentation(project);
  const isHome = variant === 'home';

  return (
    <article
      className={isHome
        ? `home-project ${lead ? 'home-project-lead' : ''} ${project.tier === 'featured' ? 'home-project-featured' : ''}`
        : 'h-full rounded-xl border bg-card p-6 text-card-foreground'}
    >
      {isHome && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="home-kicker">{presentation.accentLabel}</p>
          {ordinal !== undefined && (
            <span className="home-caption">{String(ordinal).padStart(2, '0')} / {project.tier}</span>
          )}
        </div>
      )}
      <h3 className={isHome
        ? 'mt-8 text-2xl leading-tight font-medium tracking-tight sm:text-3xl'
        : 'text-xl font-semibold tracking-tight'}>
        <Link
          href={`/projects/${project.slug}`}
          className={isHome
            ? 'home-project-title rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
            : 'rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'}
        >
          {project.title}
          {isHome && <span aria-hidden="true" className="home-accent ml-2">↗</span>}
        </Link>
      </h3>
      <p className={isHome
        ? 'home-secondary mt-5 max-w-2xl leading-7'
        : 'mt-3 leading-7 text-muted-foreground'}>
        {project.description}
      </p>
      {isHome && project.slug === 'bi-superstore-dashboard' && (
        <figure className="mt-6">
          <Image
            src="/projects/superstore-dashboard.png"
            alt="Global Superstore Power BI dashboard showing filters, KPI summaries, product bars, trends, and a world map"
            width={1300}
            height={722}
            className="h-auto w-full rounded-lg border"
          />
          <figcaption className="home-caption mt-2">Static dashboard image from the Superstore project.</figcaption>
        </figure>
      )}
      {project.role && (
        <p className={isHome ? 'mt-5 text-sm leading-6' : 'mt-4 text-sm leading-6'}>
          <span className={isHome ? 'home-secondary' : 'text-muted-foreground'}>My role / </span>
          {project.role}
        </p>
      )}
      {project.technologies.length > 0 && (
        <ul
          aria-label={`${project.title} technologies`}
          className={isHome
            ? 'mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 font-mono'
            : 'mt-5 flex flex-wrap gap-2'}
        >
          {project.technologies.slice(0, isHome ? 4 : undefined).map((technology) => (
            <li
              key={technology}
              className={isHome ? undefined : 'rounded-full bg-muted px-3 py-1 text-sm text-foreground'}
            >
              {technology}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
