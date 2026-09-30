import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCaseStudy } from '@/components/projects/project-case-study';
import { getAllProjects, getProjectBySlug } from '@/lib/content/projects';
import { getProjectPresentation } from '@/lib/projects/presentation';

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

  return <ProjectCaseStudy project={project} presentation={getProjectPresentation(project)} />;
}
