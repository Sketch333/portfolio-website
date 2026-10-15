import type { PortfolioPageContext } from "@/types/ai";
export function RecruiterPrompts({
  recruiter,
  pageContext,
  onSelect,
}: {
  recruiter: boolean;
  pageContext?: PortfolioPageContext;
  onSelect: (prompt: string) => void;
}) {
  const prompts = recruiter
    ? [
        "Summarize Aon for an AI Product role.",
        "Compare technical and business capabilities.",
      ]
    : [
        pageContext
          ? `Explain this ${pageContext.type === "blog" ? "article" : "project"} and Aon’s contribution.`
          : "Which project best demonstrates AI engineering?",
        "What has Aon written about machine learning?",
      ];
  return (
    <div aria-label="Suggested questions" className="my-5 flex flex-wrap gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="rounded border border-current px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
