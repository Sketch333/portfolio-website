import Link from "next/link";
import { siteConfig } from "@/lib/metadata/site";

export function AskPortfolio() {
  return (
    <section
      id="ask-ai"
      aria-labelledby="ask-ai-heading"
      className="home-section home-surface"
    >
      <div className="home-wrap grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-24">
        <div>
          <p className="home-kicker">04 / A closer look</p>
          <h2 id="ask-ai-heading" className="home-title">
            Ask My Portfolio
          </h2>
          <p className="home-secondary mt-6 max-w-xl text-lg leading-8">
            Have a question about the systems, the decisions, or where I
            contributed? Explore the case studies or ask me directly.
          </p>
        </div>
        <div className="border-l-2 border-current pl-6">
          <p className="home-caption">Direct conversation</p>
          <p className="mt-3 leading-7">
            The portfolio assistant is not available yet. The work, and a real
            conversation, are.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <Link href="/projects" className="home-link">
              Explore case studies
            </Link>
            <a href={`mailto:${siteConfig.email}`} className="home-link">
              Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
