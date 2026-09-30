import type { ProjectRecord } from '@/types/content';

export type DemoKind = 'scheduler' | 'video-pipeline' | 'chatbot-system' | 'iot' | 'bi-dashboard' | 'static';

export type ProjectPresentation = {
  demo: DemoKind;
  accentLabel: string;
};

const presentations: Record<string, ProjectPresentation> = {
  'university-timetable-system': { demo: 'scheduler', accentLabel: 'Constraint scheduling' },
  'ai-video-generation-pipeline': { demo: 'video-pipeline', accentLabel: 'Human-in-the-loop AI' },
  'multimodal-ai-chatbot': { demo: 'chatbot-system', accentLabel: 'Hybrid symbolic AI' },
  'industrial-iot-sensor-analytics': { demo: 'iot', accentLabel: 'Time-series analytics' },
  'bi-superstore-dashboard': { demo: 'bi-dashboard', accentLabel: 'Business intelligence' },
};

export function getProjectPresentation(project: ProjectRecord): ProjectPresentation {
  return Object.hasOwn(presentations, project.slug)
    ? presentations[project.slug]
    : { demo: 'static', accentLabel: project.tier };
}
