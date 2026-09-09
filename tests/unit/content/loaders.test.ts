import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const repositoryRoot = process.cwd();
const fixtureRoot = path.join(repositoryRoot, 'tests/fixtures');
const fixtureContentRoot = path.join(fixtureRoot, 'content');

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

async function useFixtureContentAsCanonical() {
  vi.spyOn(process, 'cwd').mockReturnValue(fixtureRoot);

  const [projects, blog, experience] = await Promise.all([
    import('@/lib/content/projects'),
    import('@/lib/content/blog'),
    import('@/lib/content/experience'),
  ]);

  return { ...projects, ...blog, ...experience };
}

describe('filesystem content loaders', () => {
  it('loads validated project MDX with trimmed bodies in filename order', async () => {
    const { loadProjectsFrom } = await import('@/lib/content/projects');

    const projects = await loadProjectsFrom(path.join(fixtureContentRoot, 'projects'));

    expect(projects.map((project) => project.slug)).toEqual([
      'demo-project',
      'unpublished-project',
    ]);
    expect(projects[0]).toMatchObject({
      slug: 'demo-project',
      tier: 'featured',
      body: 'Fixture body.',
    });
  });

  it('normalizes YAML calendar dates before validating blog MDX', async () => {
    const { loadBlogPostsFrom } = await import('@/lib/content/blog');

    const posts = await loadBlogPostsFrom(path.join(fixtureContentRoot, 'blog'));
    const demoPost = posts.find((post) => post.slug === 'demo-post');

    expect(demoPost).toMatchObject({
      publishedAt: '2026-09-08',
      updatedAt: '2026-09-09',
      body: 'Fixture article body.',
    });
  });

  it('loads validated experience JSON', async () => {
    const { loadExperienceFrom } = await import('@/lib/content/experience');

    const experience = await loadExperienceFrom(
      path.join(fixtureContentRoot, 'experience/experience.json'),
    );

    expect(experience).toEqual([
      {
        company: 'Example Co',
        role: 'Example Role',
        periodLabel: '2026',
        current: false,
        highlights: ['Fixture highlight'],
      },
    ]);
  });

  it('loads experience from the canonical content file', async () => {
    const { getExperience } = await useFixtureContentAsCanonical();

    await expect(getExperience()).resolves.toEqual([
      {
        company: 'Example Co',
        role: 'Example Role',
        periodLabel: '2026',
        current: false,
        highlights: ['Fixture highlight'],
      },
    ]);
  });

  it('rejects invalid project metadata', async () => {
    const { loadProjectsFrom } = await import('@/lib/content/projects');

    await expect(
      loadProjectsFrom(path.join(fixtureRoot, 'invalid-content/projects')),
    ).rejects.toThrow();
  });

  it('rejects invalid blog metadata', async () => {
    const { loadBlogPostsFrom } = await import('@/lib/content/blog');

    await expect(
      loadBlogPostsFrom(path.join(fixtureRoot, 'invalid-content/blog')),
    ).rejects.toThrow();
  });

  it('rejects invalid experience metadata', async () => {
    const { loadExperienceFrom } = await import('@/lib/content/experience');

    await expect(
      loadExperienceFrom(path.join(fixtureRoot, 'invalid-content/experience.json')),
    ).rejects.toThrow();
  });

  it('rejects duplicate project slugs', async () => {
    const { loadProjectsFrom } = await import('@/lib/content/projects');

    await expect(
      loadProjectsFrom(path.join(fixtureRoot, 'duplicate-content/projects')),
    ).rejects.toThrow(/duplicate project slug.*duplicate-project/i);
  });

  it('rejects duplicate blog slugs', async () => {
    const { loadBlogPostsFrom } = await import('@/lib/content/blog');

    await expect(
      loadBlogPostsFrom(path.join(fixtureRoot, 'duplicate-content/blog')),
    ).rejects.toThrow(/duplicate blog post slug.*duplicate-post/i);
  });

  it('filters unpublished projects and returns null for a missing slug', async () => {
    const { getAllProjects, getProjectBySlug } = await useFixtureContentAsCanonical();

    expect((await getAllProjects()).map((project) => project.slug)).toEqual(['demo-project']);
    await expect(getProjectBySlug('demo-project')).resolves.toMatchObject({
      slug: 'demo-project',
    });
    await expect(getProjectBySlug('missing-project')).resolves.toBeNull();
  });

  it('sorts published posts newest-first with deterministic ties', async () => {
    const { getAllPosts } = await useFixtureContentAsCanonical();

    expect((await getAllPosts()).map((post) => post.slug)).toEqual([
      'tied-post',
      'demo-post',
      'older-post',
    ]);
  });

  it('returns a post by slug and null for a missing slug', async () => {
    const { getPostBySlug } = await useFixtureContentAsCanonical();

    await expect(getPostBySlug('demo-post')).resolves.toMatchObject({ slug: 'demo-post' });
    await expect(getPostBySlug('missing-post')).resolves.toBeNull();
  });
});
