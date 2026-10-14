// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildStructuredContext, matchStructuredEvidence } from '@/lib/ai/structured-context';
import { evidenceSchema } from '@/lib/ai/schemas';

describe('deterministic structured portfolio evidence', () => {
  it.each(['current role', 'SprintX', 'What is Aon doing now?'])('finds the current role for %s', async (query) => {
    const matches = matchStructuredEvidence(query, await buildStructuredContext());
    expect(matches[0]).toMatchObject({ type: 'experience', text: 'SprintX — Business Developer — Present', href: '/#experience' });
  });
  it.each([
    ['Full-Stack Integration Lead', 'project:university-timetable-system'],
    ['Neo4j', 'project:multimodal-ai-chatbot'],
    ['Teaching Assistant', 'experience:department-of-ai-umt'],
  ])('retrieves exact canonical facts for %s', async (query, id) => {
    expect(matchStructuredEvidence(query, await buildStructuredContext())[0]?.id).toBe(id);
  });
  it('retains scheduler team and personal contribution boundaries', async () => {
    const matches = matchStructuredEvidence('What did Aon personally do on the scheduler?', await buildStructuredContext());
    expect(matches[0]?.id).toBe('project:university-timetable-system');
    expect(matches[0]?.text).toContain('A four-person team built');
    expect(matches[0]?.text).toContain('My verified contribution areas included electives scheduling');
    expect(matches[0]?.text).toContain('APIs for solver execution, polling, and capacity data');
  });
  it('retains project limitations and excludes presentation markup', async () => {
    const evidence = await buildStructuredContext();
    expect(evidence.find(({ id }) => id === 'project:multimodal-ai-chatbot')?.text).toContain('does not assert independently audited working hardware');
    expect(evidence.find(({ id }) => id === 'project:bi-superstore-dashboard')?.text).not.toContain('<figure>');
  });
  it('emits stable schema-valid evidence and no unsupported SprintX details', async () => {
    const first = await buildStructuredContext();
    expect(first).toEqual(await buildStructuredContext());
    expect(new Set(first.map(({ id }) => id)).size).toBe(first.length);
    first.forEach((source) => expect(evidenceSchema.safeParse(source).success).toBe(true));
    expect(first.find(({ id }) => id === 'experience:sprintx')?.text).toBe('SprintX — Business Developer — Present');
  });
  it.each(['', 'the and what is', 'Has Aon led a billion-dollar acquisition?', 'unicorn quantum teleportation', 'Has Aon led a billion-dollar acquisition in his current role?'])('returns no evidence for unsupported query %s', async (query) => {
    expect(matchStructuredEvidence(query, await buildStructuredContext())).toEqual([]);
  });
  it('matches case and punctuation without mutating supplied evidence', async () => {
    const evidence = await buildStructuredContext();
    const snapshot = structuredClone(evidence);
    expect(matchStructuredEvidence('NEO4J?', evidence)[0]?.id).toBe('project:multimodal-ai-chatbot');
    expect(evidence).toEqual(snapshot);
  });
});
