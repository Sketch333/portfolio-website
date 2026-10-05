import { z } from 'zod';

const publicUrlSchema = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'URL must use the HTTP or HTTPS protocol',
  });

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tier: z.enum(['flagship', 'featured', 'archive']),
  technologies: z.array(z.string().min(1)),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  role: z.string().min(1).optional(),
  sourceUrl: publicUrlSchema.optional(),
  demoUrl: publicUrlSchema.optional(),
});

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  publishedAt: z.string().date().optional(),
  updatedAt: z.string().date().optional(),
  tags: z.array(z.string().min(1)).min(1),
  category: z.enum(['technical', 'build-journal']),
  excerpt: z.string().min(1),
  coverImage: z.string().startsWith('/').refine((value) => !value.startsWith('//')).optional(),
  relatedProjectSlugs: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const experienceRecordSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  periodLabel: z.string().min(1),
  current: z.boolean().default(false),
  highlights: z.array(z.string()),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
