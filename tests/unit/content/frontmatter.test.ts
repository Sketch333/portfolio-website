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

  it('accepts a post without an unavailable publication date', () => {
    expect(blogFrontmatterSchema.parse({
      title: 'Data Preprocessing',
      description: 'Cleaning data for analysis.',
      slug: 'data-preprocessing',
      tags: ['Data Science'],
      category: 'technical',
      excerpt: 'A short summary.',
      published: true,
    })).not.toHaveProperty('publishedAt');
  });

  it('accepts technical editorial metadata and rejects unsupported categories', () => {
    const post = {
      title: 'Data Preprocessing',
      description: 'Cleaning data for analysis.',
      slug: 'data-preprocessing',
      publishedAt: '2026-01-02',
      tags: ['Data Science'],
      category: 'technical',
      excerpt: 'A practical guide to preparing data.',
    };

    expect(blogFrontmatterSchema.parse(post)).toMatchObject({
      category: 'technical',
      excerpt: 'A practical guide to preparing data.',
    });
    expect(() => blogFrontmatterSchema.parse({ ...post, category: 'career' })).toThrow();
  });

  it('validates optional cover images and related project slugs', () => {
    const post = {
      title: 'Data Preprocessing',
      description: 'Cleaning data for analysis.',
      slug: 'data-preprocessing',
      publishedAt: '2026-01-02',
      tags: ['Data Science'],
      category: 'build-journal',
      excerpt: 'A practical guide to preparing data.',
      coverImage: '/images/data-preprocessing.webp',
      relatedProjectSlugs: ['timetable-system'],
    };

    expect(blogFrontmatterSchema.parse(post)).toMatchObject({
      coverImage: '/images/data-preprocessing.webp',
      relatedProjectSlugs: ['timetable-system'],
    });
    expect(() => blogFrontmatterSchema.parse({ ...post, coverImage: 'images/cover.webp' })).toThrow();
    expect(() => blogFrontmatterSchema.parse({ ...post, coverImage: '//example.com/cover.webp' })).toThrow();
    expect(() => blogFrontmatterSchema.parse({ ...post, relatedProjectSlugs: ['Bad Slug'] })).toThrow();
  });

  it('rejects timestamps when a calendar publication date is supplied', () => {
    expect(() => blogFrontmatterSchema.parse({
      title: 'Post',
      description: 'Description',
      slug: 'post',
      publishedAt: '2026-01-02T12:00:00Z',
      tags: ['Writing'],
      category: 'technical',
      excerpt: 'A short summary.',
    })).toThrow();
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
      category: 'technical',
      excerpt: 'A short summary.',
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
