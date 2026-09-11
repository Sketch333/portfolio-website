import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjects } from '@/lib/content/projects';
import type { ProjectTier } from '@/types/content';

export const metadata: Metadata = {
  title: 'Projects | Aon Kazmi',
  description: 'Selected AI, data, and product projects by Aon Kazmi.',
};

const tiers: ReadonlyArray<{ tier: ProjectTier; title: string }> = [
  { tier: 'flagship', title: 'Flagship projects' },
  { tier: 'featured', title: 'Featured projects' },
  { tier: 'archive', title: 'Archive projects' },
];

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground">SELECTED WORK</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Projects</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        AI, data, and product work with the evidence and personal contribution boundaries available today.
      </p>

      <div className="mt-14 space-y-14">
        {tiers.map(({ tier, title }) => {
          const projectsInTier = projects.filter((project) => project.tier === tier);
          if (projectsInTier.length === 0) return null;

          return (
            <section key={tier} aria-labelledby={`${tier}-projects`}>
              <h2 id={`${tier}-projects`} className="text-2xl font-semibold tracking-tight">
                {title}
              </h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {projectsInTier.map((project) => (
                  <li key={project.slug}>
                    <article className="h-full rounded-xl border bg-card p-6 text-card-foreground">
                      <h3 className="text-xl font-semibold tracking-tight">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                        {project.technologies.map((technology) => (
                          <li key={technology} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">
                            {technology}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
