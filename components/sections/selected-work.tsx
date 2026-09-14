import Link from "next/link";
import type { ProjectRecord } from "@/types/content";
import { getProjectPresentation } from "@/lib/projects/presentation";

export function SelectedWork({ projects }: { projects: ProjectRecord[] }) {
  const ordered = [...projects].sort((a, b) => {
    if (a.slug === "university-timetable-system") return -1;
    if (b.slug === "university-timetable-system") return 1;
    return Number(b.tier === "flagship") - Number(a.tier === "flagship");
  });
  return (
    <section id="work" aria-labelledby="work-heading" className="home-section">
      <div className="home-wrap">
        <div className="home-section-header">
          <div>
            <p className="home-kicker">01 / Systems & applications</p>
            <h2 id="work-heading" className="home-title">
              Selected Work
            </h2>
          </div>
          <Link href="/projects" className="home-link">
            Browse projects
          </Link>
        </div>
        <div className="home-projects">
          {ordered.map((project, index) => (
            <article
              key={project.slug}
              className={`home-project ${index === 0 ? "home-project-lead" : ""} ${project.tier === "featured" ? "home-project-featured" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="home-kicker">
                  {getProjectPresentation(project).accentLabel}
                </p>
                <span className="home-caption">
                  {String(index + 1).padStart(2, "0")} / {project.tier}
                </span>
              </div>
              <h3 className="mt-8 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
                <Link
                  href={`/projects/${project.slug}`}
                  className="home-project-title"
                >
                  {project.title}
                  <span aria-hidden="true" className="home-accent ml-2">
                    ↗
                  </span>
                </Link>
              </h3>
              <p className="home-secondary mt-5 max-w-2xl leading-7">
                {project.description}
              </p>
              {project.role && (
                <p className="mt-5 text-sm leading-6">
                  <span className="home-secondary">My role / </span>
                  {project.role}
                </p>
              )}
              <ul
                aria-label="Technologies"
                className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 font-mono"
              >
                {project.technologies.slice(0, 4).map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
