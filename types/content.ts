export type ProjectTier = 'flagship' | 'featured' | 'archive';

export type ProjectRecord = {
  title: string;
  description: string;
  slug: string;
  tier: ProjectTier;
  technologies: string[];
  featured: boolean;
  published: boolean;
  role?: string;
  sourceUrl?: string;
  demoUrl?: string;
  body: string;
};

export type BlogPostRecord = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  body: string;
};

export type ExperienceRecord = {
  company: string;
  role: string;
  periodLabel: string;
  current: boolean;
  highlights: string[];
  startDate?: string;
  endDate?: string;
};
