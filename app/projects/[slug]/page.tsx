import { buildPageMetadata } from '@/lib/metadata/build-metadata';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/metadata/json-ld';
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
import { BiDashboardExplorer } from '@/components/projects/demos/bi-dashboard-explorer';

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

  return buildPageMetadata({ ...project, pathname: `/projects/${project.slug}`, ogImage: `/projects/${project.slug}/opengraph-image` });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', pathname: '/' }, { name: 'Projects', pathname: '/projects' }, { name: project.title, pathname: `/projects/${project.slug}` }]);

  const presentation = getProjectPresentation(project);
  const sequence = [
    'university-timetable-system',
    'ai-video-generation-pipeline',
    'multimodal-ai-chatbot',
    'industrial-iot-sensor-analytics',
    'bi-superstore-dashboard',
  ];
  const projects = await getAllProjects();
  const ordered = [...projects].sort((a, b) => {
    const aRank = sequence.indexOf(a.slug);
    const bRank = sequence.indexOf(b.slug);
    return (aRank < 0 ? sequence.length : aRank) - (bRank < 0 ? sequence.length : bRank);
  });
  const position = ordered.findIndex((item) => item.slug === project.slug);
  const nextProject = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : undefined;
  const demo = presentation.demo === 'scheduler'
    ? <SchedulerDemoLoader fallback={<SchedulerDemoFallback />} />
    : presentation.demo === 'video-pipeline'
      ? <VideoPipelineDemo />
      : presentation.demo === 'chatbot-system'
        ? <ChatbotSystemDemo />
        : presentation.demo === 'iot'
          ? <IotSensorDemo />
          : presentation.demo === 'bi-dashboard'
            ? <BiDashboardExplorer />
            : undefined;
  return <>
    {breadcrumbs ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} /> : null}
    <ProjectCaseStudy project={project} presentation={presentation} demo={demo} nextProject={nextProject} />
  </>;
}
