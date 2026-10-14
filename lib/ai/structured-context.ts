import { getAllProjects } from '@/lib/content/projects';
import { getExperience } from '@/lib/content/experience';
import { evidenceSchema } from '@/lib/ai/schemas';
import type { Evidence } from '@/types/ai';

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function slug(value: string): string {
  return normalize(value).replace(/ /g, '-');
}

// Only authored overview/contribution and limitation paragraphs join metadata here. Architecture
// and other long-form sections remain the semantic retrieval layer's responsibility.
function contributionSections(body: string): string[] {
  return [...body.matchAll(/^## (Overview|Contribution|My Contribution|Evidence boundary|Validation)\s*\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
    .map((match) => match[2].split(/\r?\n\s*</)[0].trim()).filter(Boolean);
}

export async function buildStructuredContext(): Promise<Evidence[]> {
  const [projects, experience] = await Promise.all([getAllProjects(), getExperience()]);
  return [
    ...projects.map((project) => evidenceSchema.parse({
      id: `project:${project.slug}`,
      type: 'project',
      title: project.title,
      href: `/projects/${project.slug}`,
      text: [project.title, project.description, project.role && `Role: ${project.role}`,
        `Technologies: ${project.technologies.join(', ')}`, ...contributionSections(project.body)]
        .filter(Boolean).join('\n'),
    })),
    ...experience.map((entry) => evidenceSchema.parse({
      id: `experience:${slug(entry.company)}`,
      type: 'experience',
      title: `${entry.role} — ${entry.company}`,
      href: '/#experience',
      // Current SprintX facts deliberately exclude unverified dates/highlights.
      text: entry.company === 'SprintX'
        ? `${entry.company} — ${entry.role} — ${entry.periodLabel}`
        : [ `${entry.company} — ${entry.role} — ${entry.periodLabel}`, ...entry.highlights ].join('\n'),
    })),
  ];
}

const queryWords = new Set('a an the and or what which who is are was has have did does do on in at of for to with uses use project projects aon he his him personally contribution contributions role tell me about'.split(' '));

/** Conservative lexical retrieval: all meaningful query terms must be supported.
 * No provider, embeddings, credentials, or mutable ranking state are required.
 */
export function matchStructuredEvidence(query: string, evidence: Evidence[]): Evidence[] {
  const normalized = normalize(query);
  if (!normalized) return [];
  const currentRoleQuery = normalized.replace(/\bcurrent role\b|\bdoing now\b/g, '').trim();
  if (currentRoleQuery !== normalized && currentRoleQuery.split(' ').every((term) => !term || queryWords.has(term))) {
    return evidence.filter((source) => source.type === 'experience' && /\bPresent\b/.test(source.text));
  }
  const terms = [...new Set(normalized.split(' ').filter((term) => !queryWords.has(term)))];
  if (!terms.length) return [];
  return evidence.filter((source) => {
    const tokens = new Set(normalize(`${source.title} ${source.text}`).split(' '));
    // The approved scheduling project is also referred to as "the scheduler".
    if (source.id === 'project:university-timetable-system') tokens.add('scheduler');
    return terms.every((term) => tokens.has(term));
  });
}
