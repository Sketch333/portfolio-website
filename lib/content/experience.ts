import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { experienceRecordSchema } from './frontmatter';
import type { ExperienceRecord } from '@/types/content';

export async function loadExperienceFrom(file: string): Promise<ExperienceRecord[]> {
  const raw: unknown = JSON.parse(await fs.readFile(file, 'utf8'));
  return z.array(experienceRecordSchema).parse(raw);
}

export function getExperience(): Promise<ExperienceRecord[]> {
  const experienceFile = path.join(process.cwd(), 'content/experience/experience.json');
  return loadExperienceFrom(experienceFile);
}
