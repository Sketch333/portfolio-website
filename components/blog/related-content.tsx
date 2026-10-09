import Link from 'next/link';
import type { BlogPostRecord, ProjectRecord } from '@/types/content';

export function RelatedContent({ projects, previous, next }: { projects: ProjectRecord[]; previous?: BlogPostRecord; next?: BlogPostRecord }) {
  return <footer className="writing-related">
    {projects.length > 0 && <section aria-labelledby="related-projects"><p className="writing-kicker">Further portfolio examples</p><h2 id="related-projects">Related projects</h2><ul>{projects.map(project => <li key={project.slug}><Link href={`/projects/${project.slug}`}>{project.title} <span aria-hidden="true">↗</span></Link><p>{project.description}</p></li>)}</ul></section>}
    <nav aria-label="More writing" className="writing-neighbors">{previous && <Link href={`/blog/${previous.slug}`}><span className="writing-kicker">← Previous article</span>{previous.title}</Link>}{next && <Link href={`/blog/${next.slug}`}><span className="writing-kicker">Next article →</span>{next.title}</Link>}</nav>
    <Link href="/blog" className="writing-back">Explore all writing →</Link>
  </footer>;
}
