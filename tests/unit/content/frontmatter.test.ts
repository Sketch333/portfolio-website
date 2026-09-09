import { describe, expect, it } from 'vitest';
import {
  blogFrontmatterSchema,
  experienceRecordSchema,
  projectFrontmatterSchema,
} from '@/lib/content/frontmatter';

describe('content schemas', () => {
  it('accepts a valid flagship project', () => {
    const result = projectFrontmatterSchema.parse({
      title: 'University Timetable Scheduling System',
      description: 'Constraint-based scheduling and full-stack integration.',
      slug: 'university-timetable-system',
      tier: 'flagship',
      technologies: ['Django REST Framework', 'React', 'OR-Tools'],
      featured: true,
      published: true,
    });

    expect(result.tier).toBe('flagship');
  });

  it('rejects a post without a publication date', () => {
    expect(() =>
      blogFrontmatterSchema.parse({
        title: 'Data Preprocessing',
        description: 'Cleaning data for analysis.',
        slug: 'data-preprocessing',
        tags: ['Data Science'],
        published: true,
      }),
    ).toThrow();
  });

  it('allows an experience entry without unverified metrics', () => {
    const result = experienceRecordSchema.parse({
      company: 'SprintX',
      role: 'Business Developer',
      periodLabel: 'Present',
      current: true,
      highlights: [],
    });

    expect(result.highlights).toHaveLength(0);
  });

  it('rejects slugs outside the lowercase kebab-case format', () => {
    expect(() =>
      projectFrontmatterSchema.parse({
        title: 'Project',
        description: 'Description',
        slug: 'Project With Spaces',
        tier: 'archive',
        technologies: ['TypeScript'],
      }),
    ).toThrow();
  });

  it('rejects invalid calendar dates', () => {
    expect(() =>
      blogFrontmatterSchema.parse({
        title: 'Data Preprocessing',
        description: 'Cleaning data for analysis.',
        slug: 'data-preprocessing',
        publishedAt: '2026-02-30',
        tags: ['Data Science'],
      }),
    ).toThrow();
  });

  it('accepts public HTTP(S) URLs and rejects other protocols', () => {
    const result = projectFrontmatterSchema.parse({
      title: 'Project',
      description: 'Description',
      slug: 'project',
      tier: 'featured',
      technologies: ['TypeScript'],
      sourceUrl: 'https://example.com/source',
      demoUrl: 'http://example.com/demo',
    });

    expect(result.sourceUrl).toBe('https://example.com/source');
    expect(() =>
      projectFrontmatterSchema.parse({
        title: 'Project',
        description: 'Description',
        slug: 'project',
        tier: 'featured',
        technologies: ['TypeScript'],
        sourceUrl: 'javascript:alert(1)',
      }),
    ).toThrow();
  });

  it('applies safe defaults for optional frontmatter facts', () => {
    const project = projectFrontmatterSchema.parse({
      title: 'Project',
      description: 'Description',
      slug: 'project',
      tier: 'archive',
      technologies: ['TypeScript'],
    });
    const post = blogFrontmatterSchema.parse({
      title: 'Post',
      description: 'Description',
      slug: 'post',
      publishedAt: '2026-01-02',
      tags: ['Writing'],
    });
    const experience = experienceRecordSchema.parse({
      company: 'SprintX',
      role: 'Business Developer',
      periodLabel: 'Present',
      highlights: [],
    });

    expect(project).toMatchObject({ featured: false, published: true });
    expect(post).toMatchObject({ featured: false, published: true });
    expect(experience.current).toBe(false);
  });
});
