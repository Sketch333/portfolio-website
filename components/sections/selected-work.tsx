import Link from 'next/link';
import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectRecord } from '@/types/content';

export function SelectedWork({ projects }: { projects: ProjectRecord[] }) {
  const ordered = [...projects].sort((a, b) => {
    if (a.slug === 'university-timetable-system') return -1;
    if (b.slug === 'university-timetable-system') return 1;
    return Number(b.tier === 'flagship') - Number(a.tier === 'flagship');
  });
  return (
    <section id="work" aria-labelledby="work-heading" className="home-section">
      <div className="home-wrap">
        <div className="home-section-header">
          <div>
            <p className="home-kicker">01 / Systems & applications</p>
            <h2 id="work-heading" className="home-title">Selected Work</h2>
          </div>
          <Link href="/projects" className="home-link">Browse projects</Link>
        </div>
        <div className="home-projects">
          {ordered.map((project, index) => (
            <ProjectCard key={project.slug} project={project} variant="home" ordinal={index + 1} lead={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
