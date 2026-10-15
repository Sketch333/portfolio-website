import type { EvidenceReference } from "@/types/ai";
export function EvidenceLinks({ evidence }: { evidence: EvidenceReference[] }) {
  return evidence.length ? (
    <nav aria-label="Answer sources">
      <ul className="mt-4 space-y-2">
        {evidence.map((source) => (
          <li key={source.id}>
            <a className="home-link" href={source.href}>
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
}
