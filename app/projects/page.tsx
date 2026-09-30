import type { Metadata } from 'next';
import { ProjectCard } from '@/components/projects/project-card';
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
              <h2 id={`${tier}-projects`} className="text-2xl font-semibold tracking-tight">{title}</h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2">
                {projectsInTier.map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} variant="index" />
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
