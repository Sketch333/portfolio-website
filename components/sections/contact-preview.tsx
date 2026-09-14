import { siteConfig } from "@/lib/metadata/site";

export function ContactPreview() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="home-section home-contact"
    >
      <div className="home-wrap">
        <p className="home-kicker">07 / Start a conversation</p>
        <h2 id="contact-heading" className="home-title">
          Contact
        </h2>
        <p className="mt-8 max-w-3xl text-4xl leading-tight font-medium tracking-tight sm:text-6xl">
          What could we
          <br />
          build together?
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-8 border-t pt-8">
          <p className="home-secondary max-w-md leading-7">
            For project conversations, collaboration, or questions about my
            work, reach out directly.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="home-link text-lg break-all"
          >
            {siteConfig.email} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
