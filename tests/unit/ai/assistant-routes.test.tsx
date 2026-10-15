import { Children, isValidElement, type ReactNode } from "react";
import { expect, it, vi } from "vitest";
import ProjectPage from "@/app/projects/[slug]/page";
import BlogPage from "@/app/blog/[slug]/page";
import { AskPortfolio } from "@/components/sections/ask-portfolio";
vi.mock("@/lib/content/mdx", () => ({ renderMdx: async () => null }));
function findAssistant(node: ReactNode): Record<string, unknown> | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue;
    if (child.type === AskPortfolio) return child.props;
    const found = findAssistant(child.props.children);
    if (found) return found;
  }
}
it("mounts a page-aware assistant on real project and article routes", async () => {
  const project = await ProjectPage({
    params: Promise.resolve({ slug: "university-timetable-system" }),
  });
  expect(findAssistant(project)?.pageContext).toEqual({
    type: "project",
    slug: "university-timetable-system",
  });
  const article = await BlogPage({
    params: Promise.resolve({
      slug: "data-preprocessing-a-guide-to-cleaning-your-data",
    }),
  });
  expect(findAssistant(article)?.pageContext).toEqual({
    type: "blog",
    slug: "data-preprocessing-a-guide-to-cleaning-your-data",
  });
});
