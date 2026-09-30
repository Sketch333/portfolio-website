const stages = [
  {
    title: "Data",
    detail: "Explore and structure evidence",
    evidence: "Sensor analytics · Power BI",
  },
  {
    title: "Intelligence",
    detail: "Turn patterns into useful reasoning",
    evidence: "Anomaly methods · AIML · Prolog · Neo4j",
  },
  {
    title: "Product",
    detail: "Build systems people can use",
    evidence: "Full-stack integration · CP-SAT scheduling · FFmpeg pipeline",
  },
  {
    title: "Business Impact",
    detail: "Connect technical work to decisions",
    evidence: "Decision support · product framing",
  },
] as const;

export function Capabilities() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="home-section home-surface"
    >
      <div className="home-wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <p className="home-kicker">02 / What I bring</p>
          <div>
            <h2 id="capabilities-heading" className="home-title !mt-0">
              AI × Data × Product × Business
            </h2>
            <p className="home-secondary mt-8 max-w-2xl text-xl leading-9">
              Data, intelligence, and product engineering form a connected
              practice. Business perspective helps frame where those systems can
              be useful.
            </p>
          </div>
        </div>
        <ol
          aria-label="Capability progression"
          className="mt-12 grid border-t border-l sm:grid-cols-2 xl:grid-cols-4"
        >
          {stages.map((stage, index) => (
            <li
              key={stage.title}
              className="flex min-w-0 flex-col border-r border-b p-6 md:p-8"
            >
              <span className="home-kicker">0{index + 1} / 04</span>
              <h3 className="mt-7 text-2xl font-medium tracking-tight">
                {stage.title}
              </h3>
              <p className="home-secondary mt-3 leading-7">{stage.detail}</p>
              <p className="home-caption mt-8 border-t pt-4">{stage.evidence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
