import type { Metadata } from 'next';
import { getExperience } from '@/lib/content/experience';

export const metadata: Metadata = {
  title: 'About | Aon Kazmi',
  description: 'Aon Kazmi works across AI, data, product, and business opportunities.',
};

function suppliedPeriod(startDate?: string, endDate?: string) {
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  if (startDate) return startDate;
  return undefined;
}

export default async function AboutPage() {
  const experience = await getExperience();

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground">ABOUT</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">About</h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        I work at the intersection of AI, Data, and Product, connecting technical depth with business context and useful outcomes.
      </p>

      <section className="mt-14" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="text-2xl font-semibold tracking-tight">Experience</h2>
        <ol className="mt-6 space-y-5">
          {experience.map((entry) => {
            const period = entry.current && entry.periodLabel === 'Present'
              ? 'Present'
              : suppliedPeriod(entry.startDate, entry.endDate);

            return (
              <li key={`${entry.company}-${entry.role}`} className="rounded-xl border bg-card p-6 text-card-foreground">
                <h3 className="text-xl font-semibold">{entry.role}</h3>
                <p className="mt-1 text-muted-foreground">{entry.company}</p>
                {period ? <p className="mt-3 text-sm text-muted-foreground">{period}</p> : null}
              </li>
            );
          })}
        </ol>
      </section>
    </section>
  );
}
