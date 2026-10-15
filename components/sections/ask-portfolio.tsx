import { LazyAskPortfolio } from "@/components/ai/lazy-ask-portfolio";
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
            contributed? Explore the evidence behind the work.
          </p>
        </div>
        <div className="border-l-2 border-current pl-6">
          <LazyAskPortfolio />
        </div>
      </div>
    </section>
  );
}
