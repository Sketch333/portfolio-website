import type { ReactNode } from 'react';
import type { Heading, Root, RootContent } from 'mdast';
import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/blog/mdx-components';
import type { ProjectRecord } from '@/types/content';

const sectionNames = [
  'Overview',
  'The Problem',
  'Why It Was Difficult',
  'System / Architecture',
  'My Contribution',
  'Engineering Decisions',
  'Interactive Demonstration',
  'Technology',
  'Results / Metrics',
  'What I Learned',
  'Source / Demo / Related Writing',
] as const;

type SectionName = (typeof sectionNames)[number];

const aliases: Record<string, SectionName> = {
  overview: 'Overview',
  problem: 'The Problem',
  'the problem': 'The Problem',
  'why difficult': 'Why It Was Difficult',
  'why it was difficult': 'Why It Was Difficult',
  architecture: 'System / Architecture',
  system: 'System / Architecture',
  'system / architecture': 'System / Architecture',
  contribution: 'My Contribution',
  'my contribution': 'My Contribution',
  'engineering decisions': 'Engineering Decisions',
  'interactive demonstration': 'Interactive Demonstration',
  technology: 'Technology',
  technologies: 'Technology',
  results: 'Results / Metrics',
  'results / metrics': 'Results / Metrics',
  'what i learned': 'What I Learned',
  'source / demo / related writing': 'Source / Demo / Related Writing',
};

const slotNames = {
  section: 'PortfolioInternalProjectSection',
  contribution: 'PortfolioInternalProjectContributionSlot',
  technology: 'PortfolioInternalProjectTechnologySlot',
  demo: 'PortfolioInternalProjectDemoSlot',
  resources: 'PortfolioInternalProjectResourcesSlot',
} as const;

type Group = { name: SectionName | null; nodes: RootContent[]; trailing: Group[] };
export type ProjectSectionLink = { id: string; label: string };

function headingText(node: Heading) {
  const read = (value: { value?: string; children?: unknown[] }): string =>
    value.value ?? value.children?.map((child) => read(child as { value?: string; children?: unknown[] })).join('') ?? '';
  return node.children.map((child) => read(child as { value?: string; children?: unknown[] })).join('').trim();
}

function headingName(node: Heading): SectionName | null {
  const heading = headingText(node).toLowerCase();
  return aliases[heading] ?? null;
}

function heading(name: SectionName): Heading {
  return { type: 'heading', depth: 2, children: [{ type: 'text', value: name }] };
}

function slot(name: string): RootContent {
  return { type: 'mdxJsxFlowElement', name, attributes: [], children: [] } as RootContent;
}

function assertSlotsUnclaimed(node: unknown) {
  if (!node || typeof node !== 'object') return;
  const candidate = node as { name?: string; children?: unknown[] };
  if (candidate.name && Object.values(slotNames).includes(candidate.name as (typeof slotNames)[keyof typeof slotNames])) {
    throw new Error(`Reserved project MDX component name: ${candidate.name}`);
  }
  candidate.children?.forEach(assertSlotsUnclaimed);
}

function projectSectionPlugin(project: ProjectRecord, hasDemo: boolean, hasResources: boolean, sectionLinks: ProjectSectionLink[]) {
  return () => (tree: Root) => {
    assertSlotsUnclaimed(tree);

    const preamble: RootContent[] = [];
    const groups: Group[] = [];
    let current: Group | null = null;
    let lastRecognized: Group | null = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        const name = headingName(node);
        const group: Group = { name, nodes: [name ? heading(name) : node], trailing: [] };
        if (name) {
          groups.push(group);
          lastRecognized = group;
        } else if (lastRecognized) {
          lastRecognized.trailing.push(group);
        } else {
          groups.push(group);
        }
        current = group;
      } else if (current) {
        current.nodes.push(node);
      } else {
        preamble.push(node);
      }
    }

    function ensureGroup(name: SectionName): Group {
      const existing = groups.find((group) => group.name === name);
      if (existing) return existing;
      const created: Group = { name, nodes: [heading(name)], trailing: [] };
      groups.push(created);
      return created;
    }

    if (project.role) ensureGroup('My Contribution').nodes.splice(1, 0, slot(slotNames.contribution));
    if (project.technologies.length) ensureGroup('Technology').nodes.splice(1, 0, slot(slotNames.technology));
    if (hasDemo) ensureGroup('Interactive Demonstration').nodes.splice(1, 0, slot(slotNames.demo));
    if (hasResources) {
      ensureGroup('Source / Demo / Related Writing').nodes.splice(1, 0, slot(slotNames.resources));
    }

    const rank = (group: Group) => group.name ? sectionNames.indexOf(group.name) : sectionNames.length;
    groups.sort((left, right) => rank(left) - rank(right));
    const seen = new Map<string, number>();
    const ordered = groups.flatMap((group) => [group, ...group.trailing]);
    tree.children = [
      ...preamble,
      ...ordered.map((group) => {
        const title = headingText(group.nodes[0] as Heading);
        const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        const id = `case-${base}${count > 1 ? `-${count}` : ''}`;
        sectionLinks.push({ id, label: title });
        return {
          type: 'mdxJsxFlowElement',
          name: slotNames.section,
          attributes: [{ type: 'mdxJsxAttribute', name: 'id', value: id }],
          children: group.nodes,
        } as RootContent;
      }),
    ];
  };
}

function publicUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : null;
  } catch {
    return null;
  }
}

export async function renderProjectMdx(project: ProjectRecord, demo?: ReactNode) {
  const hasDemo = demo !== undefined && demo !== null && demo !== false && demo !== '';
  const sourceUrl = publicUrl(project.sourceUrl);
  const demoUrl = publicUrl(project.demoUrl);
  const sections: ProjectSectionLink[] = [];
  const { content } = await compileMDX({
    source: project.body,
    components: {
      ...mdxComponents,
      [slotNames.section]: ({ id, children }: { id: string; children: ReactNode }) => <section className="project-section" id={id}>{children}</section>,
      [slotNames.contribution]: () => <p className="mt-4 font-medium leading-7">{project.role}</p>,
      [slotNames.technology]: () => (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.map((technology) => (
            <li key={technology} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">
              {technology}
            </li>
          ))}
        </ul>
      ),
      [slotNames.demo]: () => <>{demo}</>,
      [slotNames.resources]: () => (
        <ul className="mt-4 flex flex-wrap gap-4">
          {sourceUrl && <li><a href={sourceUrl}>Source</a></li>}
          {demoUrl && <li><a href={demoUrl}>Demo</a></li>}
        </ul>
      ),
    },
    options: { mdxOptions: { remarkPlugins: [projectSectionPlugin(project, hasDemo, Boolean(sourceUrl || demoUrl), sections)] } },
  });
  return { content, sections };
}
