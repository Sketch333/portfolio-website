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
    <section className="project-story project-index">
      <div className="project-story-wrap">
        <header className="project-index-hero">
          <p className="project-story-kicker">Selected work / Systems & applications</p>
          <h1>Projects</h1>
          <p>AI, data, and product work with the evidence and personal contribution boundaries available today.</p>
        </header>
        <div className="project-index-tiers">
          {tiers.map(({ tier, title }) => {
            const projectsInTier = projects.filter((project) => project.tier === tier).sort((a, b) => {
              if (a.slug === 'university-timetable-system') return -1;
              if (b.slug === 'university-timetable-system') return 1;
              if (a.slug === 'industrial-iot-sensor-analytics') return -1;
              if (b.slug === 'industrial-iot-sensor-analytics') return 1;
              return 0;
            });
            if (projectsInTier.length === 0) return null;

            return (
              <section key={tier} aria-labelledby={`${tier}-projects`} className="project-index-tier">
                <div className="project-index-tier-heading"><p className="project-story-kicker">{tier}</p><h2 id={`${tier}-projects`}>{title}</h2></div>
                <ul className="project-index-grid">
                  {projectsInTier.map((project) => (
                    <li key={project.slug} className={project.slug === 'university-timetable-system' ? 'project-index-lead' : undefined}>
                      <ProjectCard project={project} variant="index" />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
