import Link from "next/link";

import { siteConfig } from "@/lib/metadata/site";

const sectionLinkClassName =
  "font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-6 py-24">
        <p className="text-sm font-medium tracking-[0.2em]">AI · Data · Product</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl">
          From data to products.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          I build AI-driven systems with technical depth and business impact — spanning intelligent automation,
          full-stack products, analytics, and product strategy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#work"
            className="rounded-full bg-foreground px-5 py-3 text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Explore My Work
          </a>
          <a
            href="#ask-ai"
            className="rounded-full border px-5 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Ask My Portfolio
          </a>
          <a
            href="/resume"
            className="px-5 py-3 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            View résumé
          </a>
        </div>
      </section>

      <section id="work" aria-labelledby="work-heading" className="border-t px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="work-heading" className="text-2xl font-semibold tracking-tight">Selected work</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse projects that connect data, intelligent systems, and useful product experiences.
          </p>
          <Link href="/projects" className={`${sectionLinkClassName} mt-5 inline-block`}>Browse projects</Link>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-heading" className="border-t px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="experience-heading" className="text-2xl font-semibold tracking-tight">Experience</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Explore the practice behind the work across AI, data, product, and business strategy.
          </p>
          <Link href="/about" className={`${sectionLinkClassName} mt-5 inline-block`}>About this work</Link>
        </div>
      </section>

      <section id="ask-ai" aria-labelledby="ask-ai-heading" className="border-t px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="ask-ai-heading" className="text-2xl font-semibold tracking-tight">Ask My Portfolio</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Portfolio questions can be sent directly by email while the rest of the portfolio takes shape.
          </p>
          <a href={`mailto:${siteConfig.email}`} className={`${sectionLinkClassName} mt-5 inline-block`}>Email me</a>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="border-t px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="contact-heading" className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            For project conversations, collaboration, or questions about my work, reach out directly.
          </p>
          <a href={`mailto:${siteConfig.email}`} className={`${sectionLinkClassName} mt-5 inline-block`}>{siteConfig.email}</a>
        </div>
      </section>
    </>
  );
}
