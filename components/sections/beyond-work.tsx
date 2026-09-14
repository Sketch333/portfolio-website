import Link from "next/link";

export function BeyondWork() {
  return (
    <section
      aria-labelledby="beyond-heading"
      className="home-section home-surface"
    >
      <div className="home-wrap grid gap-8 md:grid-cols-[1fr_1fr] md:gap-20">
        <div>
          <p className="home-kicker">06 / The person behind the systems</p>
          <h2 id="beyond-heading" className="home-title">
            Beyond the Work
          </h2>
        </div>
        <div className="md:self-end">
          <p className="home-secondary max-w-lg text-lg leading-8">
            There is more to a conversation than a project list. Get to know the
            perspective behind this portfolio, or start a conversation of your
            own.
          </p>
          <Link href="/about" className="home-link mt-5">
            More about me
          </Link>
        </div>
      </div>
    </section>
  );
}
