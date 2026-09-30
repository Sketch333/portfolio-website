import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCaseStudy } from '@/components/projects/project-case-study';
import { getAllProjects, getProjectBySlug } from '@/lib/content/projects';
import { getProjectPresentation } from '@/lib/projects/presentation';
import { SchedulerDemoLoader } from '@/components/projects/demos/scheduler-demo-loader';
import { SchedulerDemoFallback } from '@/components/projects/demos/scheduler-demo-fallback';
import { VideoPipelineDemo } from '@/components/projects/demos/video-pipeline-demo';
import { ChatbotSystemDemo } from '@/components/projects/demos/chatbot-system-demo';
import { IotSensorDemo } from '@/components/projects/demos/iot-sensor-demo';

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

  const presentation = getProjectPresentation(project);
  const demo = presentation.demo === 'scheduler'
    ? <SchedulerDemoLoader fallback={<SchedulerDemoFallback />} />
    : presentation.demo === 'video-pipeline'
      ? <VideoPipelineDemo />
      : presentation.demo === 'chatbot-system'
        ? <ChatbotSystemDemo />
        : presentation.demo === 'iot'
          ? <IotSensorDemo />
        : undefined;
  return <ProjectCaseStudy project={project} presentation={presentation} demo={demo} />;
}
