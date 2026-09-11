import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderMdx } from '@/lib/content/mdx';
import { getAllProjects, getProjectBySlug } from '@/lib/content/projects';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getAllProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: 'Project not found | Aon Kazmi', robots: { index: false } };

  return {
    title: `${project.title} | Aon Kazmi`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const body = await renderMdx(project.body);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/projects"
        className="rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        All projects
      </Link>
      <p className="mt-8 text-sm font-medium tracking-[0.2em] text-muted-foreground">{project.tier.toUpperCase()}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.description}</p>

      {project.role ? (
        <section className="mt-10 rounded-xl border bg-card p-6 text-card-foreground" aria-labelledby="role-heading">
          <h2 id="role-heading" className="text-sm font-semibold tracking-[0.16em] text-muted-foreground">ROLE</h2>
          <p className="mt-2 text-xl font-semibold">{project.role}</p>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="technologies-heading">
        <h2 id="technologies-heading" className="text-xl font-semibold">Technologies</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <li key={technology} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">
              {technology}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">{body}</div>
    </article>
  );
}
