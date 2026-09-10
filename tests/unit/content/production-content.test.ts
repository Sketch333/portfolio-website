import { describe, expect, it } from 'vitest';
import { getAllProjects } from '@/lib/content/projects';
import { getExperience } from '@/lib/content/experience';

describe('production portfolio content', () => {
  it('contains exactly three flagship projects', async () => {
    const flagships = (await getAllProjects()).filter((project) => project.tier === 'flagship');

    expect(flagships.map((project) => project.slug).sort()).toEqual([
      'ai-video-generation-pipeline',
      'multimodal-ai-chatbot',
      'university-timetable-system',
    ]);
  });

  it('keeps SprintX first without invented highlights', async () => {
    const experience = await getExperience();

    expect(experience[0]).toMatchObject({
      company: 'SprintX',
      role: 'Business Developer',
      current: true,
    });
    expect(experience[0].highlights).toEqual([]);
  });
});
