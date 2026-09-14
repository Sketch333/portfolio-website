import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-12 scroll-mt-24 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-8 scroll-mt-24 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7 text-balance" {...props} />,
  a: (props) => <a className="underline underline-offset-4" {...props} />,
  pre: (props) => <pre className="my-6 overflow-x-auto rounded-xl border p-4" {...props} />,
};
