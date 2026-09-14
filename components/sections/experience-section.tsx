import Link from "next/link";
import type { ExperienceRecord } from "@/types/content";

export function ExperienceSection({
  experience,
}: {
  experience: ExperienceRecord[];
}) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="home-section"
    >
      <div className="home-wrap grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <p className="home-kicker">03 / Practice</p>
          <h2 id="experience-heading" className="home-title">
            Experience
          </h2>
          <Link href="/about" className="home-link mt-6">
            About this work
          </Link>
        </div>
        <ol className="border-t">
          {experience.map((item) => (
            <li key={`${item.company}-${item.role}`} className="border-b py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-2xl font-medium tracking-tight">
                  {item.company}
                </h3>
                {item.current ? (
                  <span className="home-kicker">Present</span>
                ) : item.startDate ? (
                  <span className="home-caption">
                    {item.startDate}
                    {item.endDate ? ` — ${item.endDate}` : ""}
                  </span>
                ) : null}
              </div>
              <p className="home-secondary mt-3 text-lg">{item.role}</p>
              {item.highlights.length > 0 && (
                <ul className="mt-4 list-disc pl-5 leading-7">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
