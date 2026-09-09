import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/blog/mdx-components';

export async function renderMdx(source: string) {
  const { content } = await compileMDX({ source, components: mdxComponents });
  return content;
}
