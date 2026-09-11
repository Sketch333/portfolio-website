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

  it('keeps the two verified featured projects available for conventional browsing', async () => {
    const projects = await getAllProjects();
    const featured = projects.filter((project) => project.tier === 'featured');

    expect(featured.map((project) => project.slug).sort()).toEqual([
      'bi-superstore-dashboard',
      'industrial-iot-sensor-analytics',
    ]);
    expect(featured).toHaveLength(2);
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
