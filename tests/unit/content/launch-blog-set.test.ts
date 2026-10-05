import { describe, expect, it } from 'vitest';
import { getAllPosts } from '@/lib/content/blog';

describe('curated launch writing', () => {
  it('publishes exactly the eight approved technical articles without fabricated dates', async () => {
    const posts = await getAllPosts();

    expect(posts.map((post) => post.slug).sort()).toEqual([
      'data-preprocessing-a-guide-to-cleaning-your-data',
      'deep-learning-vs-machine-learning-whats-the-difference',
      'from-data-to-insights-how-data-science-solves-business-problems',
      'how-data-visualization-enhances-decision-making',
      'how-to-build-a-simple-machine-learning-model-in-python',
      'supervised-vs-unsupervised-learning-key-differences',
      'the-ethics-of-data-science-responsibilities-of-a-data-scientist',
      'the-role-of-statistics-in-data-science',
    ]);

    for (const post of posts) {
      expect(post).toMatchObject({ featured: true, published: true, category: 'technical' });
      expect(post.publishedAt).toBeUndefined();
      expect(post.updatedAt).toBeUndefined();
    }
  });
});
