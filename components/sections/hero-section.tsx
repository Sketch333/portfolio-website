import Link from "next/link";
import { HeroSequence } from "@/components/interactive/hero-sequence";
import { siteConfig } from "@/lib/metadata/site";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="home-hero">
      <div className="home-wrap">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="home-kicker">AI · Data · Product</p>
          <p className="home-caption">Syed Aon Muhammad Kazmi / Portfolio</p>
        </div>
        <h1 id="hero-heading" className="home-headline">
          From data
          <br className="hidden sm:block" /> to <span>products.</span>
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <p className="max-w-xl text-lg leading-8 home-secondary">
            {siteConfig.description}
          </p>
          <div className="flex flex-col items-start justify-end gap-5 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <a href="#work" className="home-button">
                Explore My Work <span aria-hidden="true">↗</span>
              </a>
              <a href="#ask-ai" className="home-button home-button-outline">
                Ask My Portfolio
              </a>
            </div>
            <Link href="/resume" className="home-link">
              View résumé
            </Link>
          </div>
        </div>
        <HeroSequence />
      </div>
    </section>
  );
}
