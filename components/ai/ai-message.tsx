import type { PortfolioAnswer } from "@/types/ai";
import { EvidenceLinks } from "./evidence-links";
export function AiMessage({ response }: { response: PortfolioAnswer | null }) {
  return (
    <>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-6 whitespace-pre-wrap leading-7"
      >
        {response?.answer ?? ""}
      </p>
      {response && <EvidenceLinks evidence={response.evidence} />}
    </>
  );
}
