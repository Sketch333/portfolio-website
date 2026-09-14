import { describe, expect, it } from 'vitest';
import { getProjectPresentation } from '@/lib/projects/presentation';
import type { ProjectRecord } from '@/types/content';

const base: ProjectRecord = {
  title: 'Test project',
  description: 'Test description',
  slug: 'university-timetable-system',
  tier: 'flagship',
  technologies: [],
  featured: true,
  published: true,
  body: '',
};

describe('getProjectPresentation', () => {
  it.each([
    ['university-timetable-system', 'scheduler', 'Constraint scheduling'],
    ['ai-video-generation-pipeline', 'video-pipeline', 'Human-in-the-loop AI'],
    ['multimodal-ai-chatbot', 'chatbot-system', 'Hybrid symbolic AI'],
    ['industrial-iot-sensor-analytics', 'iot', 'Time-series analytics'],
  ])('selects the presentation for %s', (slug, demo, accentLabel) => {
    expect(getProjectPresentation({ ...base, slug })).toEqual({ demo, accentLabel });
  });

  it.each(['flagship', 'featured', 'archive'] as const)(
    'falls back to a static presentation using the %s tier',
    (tier) => {
      expect(getProjectPresentation({ ...base, slug: 'unknown-project', tier })).toEqual({
        demo: 'static',
        accentLabel: tier,
      });
    },
  );
});
