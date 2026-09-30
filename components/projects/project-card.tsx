import Link from 'next/link';
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
  const isBiHome = isHome && project.slug === 'bi-superstore-dashboard';

  return (
    <article
      className={isHome
        ? `home-project ${lead ? 'home-project-lead' : ''} ${project.tier === 'featured' ? 'home-project-featured' : ''} ${isBiHome ? 'home-project-bi' : ''}`
        : 'project-index-card'}
    >
      {isHome && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="home-kicker">{presentation.accentLabel}</p>
          {ordinal !== undefined && (
            <span className="home-caption">{String(ordinal).padStart(2, '0')} / {project.tier}</span>
          )}
        </div>
      )}
      {!isHome && <p className="project-index-card-kicker">{presentation.accentLabel}</p>}
      <h3 className={isHome
        ? 'mt-8 text-2xl leading-tight font-medium tracking-tight sm:text-3xl'
        : 'project-index-card-title'}>
        <Link
          href={`/projects/${project.slug}`}
          className={isHome
            ? 'home-project-title rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
            : 'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'}
        >
          {project.title}
          <span aria-hidden="true" className={isHome ? 'home-accent ml-2' : 'project-index-card-arrow'}>↗</span>
        </Link>
      </h3>
      <p className={isHome
        ? 'home-secondary mt-5 max-w-2xl leading-7'
        : 'project-index-card-description'}>
        {project.description}
      </p>
      {isBiHome && (
        <div className="home-bi-preview mt-7" role="group" aria-label="Superstore dashboard analysis areas">
          <div className="home-bi-preview-header">
            <p className="home-kicker">Power BI / verified artifact</p>
            <p className="home-caption">04 analytical views</p>
          </div>
          <p className="home-bi-preview-intro">One dashboard.<br />Four ways to read it.</p>
          <ol className="home-bi-preview-grid">
            {['KPI analysis', 'Geographic analysis', 'Product analysis', 'Time analysis'].map((area, index) => (
              <li key={area}>
                <span className="home-bi-preview-number">0{index + 1}</span>
                <span>{area}</span>
              </li>
            ))}
          </ol>
          <Link href={`/projects/${project.slug}`} className="home-bi-preview-link">
            View the verified dashboard <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
      {project.role && (
        <p className={isHome ? 'mt-5 text-sm leading-6' : 'mt-4 text-sm leading-6'}>
          <span className={isHome ? 'home-secondary' : 'project-index-card-muted'}>My role / </span>
          {project.role}
        </p>
      )}
      {project.technologies.length > 0 && !isBiHome && (
        <ul
          aria-label={`${project.title} technologies`}
          className={isHome
            ? 'mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 font-mono'
            : 'project-index-card-stack'}
        >
          {project.technologies.slice(0, isHome ? 4 : undefined).map((technology) => (
            <li
              key={technology}
              className={isHome ? undefined : 'project-index-card-chip'}
            >
              {technology}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
