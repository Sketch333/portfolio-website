import type { Metadata } from 'next';
import { siteConfig } from '@/lib/metadata/site';

export const metadata: Metadata = {
  title: 'Résumé | Aon Kazmi',
  description: 'Contact Aon Kazmi for the current résumé while the final public asset is confirmed.',
};

export default function ResumePage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground">RÉSUMÉ</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Résumé</h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        For the current résumé or a conversation about AI, data, and product work, contact me directly.
      </p>
      <a
        href={`mailto:${siteConfig.email}`}
        className="mt-8 inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {siteConfig.email}
      </a>
      <p className="mt-8 text-sm leading-6 text-muted-foreground">
        A downloadable résumé will be linked only when the final public résumé asset is confirmed.
      </p>
    </section>
  );
}
