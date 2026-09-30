"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const desktopQuery = "(min-width: 768px)";
function subscribeDesktop(callback: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function desktopSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}
function serverSnapshot() {
  return false;
}

const stages = [
  { label: "Data", caption: "Raw inputs become patterns." },
  { label: "Intelligence", caption: "Reasoning gives patterns direction." },
  { label: "Product", caption: "Intelligence becomes an interface." },
  { label: "Impact", caption: "Useful systems support decisions." },
];

function StageDrawing({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false" className="hero-stage-drawing">
      {stage === 0 && <>
        <path d="M24 29h25m-9 20h34m-49 22h18m18-51h25m-4 53h22m14-43h27m-23 27h40m-12 21h25" opacity=".5" />
        <path d="M52 29h8m17 20h8m-39 22h8m40-51h8m5 53h8m32-43h8m7 27h8m-4 21h8" strokeWidth="4" />
      </>}
      {stage === 1 && <>
        <path d="m35 25 60 25-60 25m60-25 60-25m-60 25 60 25M35 25v50m120-50v50" opacity=".5" />
        {[[35,25],[35,75],[95,50],[155,25],[155,75]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={cx === 95 ? 11 : 6} className="hero-node" />)}
      </>}
      {stage === 2 && <>
        <rect x="28" y="12" width="144" height="78" rx="3" />
        <path d="M28 30h144M63 30v60M39 21h3m5 0h3m5 0h3M38 42h15m-15 10h15m-15 10h10M76 43h38m-38 9h64" opacity=".5" />
        <rect x="76" y="64" width="30" height="13" rx="2" /><path d="M115 70h43m-6-5 6 5-6 5" />
      </>}
      {stage === 3 && <>
        <path d="M24 50h50m0 0 37-26h53M74 50h90M74 50l37 26h53" />
        <circle cx="24" cy="50" r="6" className="hero-node" />
        {[24,50,76].map((y) => <path key={y} d={`m153 ${y-4} 5 4-5 4`} />)}
      </>}
    </svg>
  );
}

export function HeroSequence() {
  const reducedMotion = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, serverSnapshot);
  const animate = desktop && reducedMotion === false;
  const systemRef = useRef<HTMLDivElement>(null);
  const inView = useInView(systemRef, { once: true, amount: 0.5 });

  return (
    <div className="hero-sequence">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <p className="home-caption">A connected approach</p>
        <p className="home-kicker">From possibility to purpose</p>
      </div>
      <div className="hero-system" ref={systemRef}>
        <svg viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="hero-connection">
          <path d="M0 6H1000" fill="none" stroke="var(--home-rule)" />
          {animate ? <motion.path d="M0 6H1000" fill="none" stroke="var(--home-accent)" strokeWidth="2" initial={false}
            animate={inView ? { pathLength: [0, 1] } : { pathLength: 1 }}
            transition={{ duration: 2.4, ease: "easeInOut" }} /> : <path d="M0 6H1000" fill="none" stroke="var(--home-accent)" strokeWidth="2" />}
        </svg>
        <ol aria-label="From data to impact" className="hero-stages">
          {stages.map(({ label, caption }, index) => (
            <li key={label} className="hero-stage">
              <span className="hero-stage-index home-caption" aria-hidden="true">0{index + 1}</span>
              <StageDrawing stage={index} />
              <div className="hero-stage-copy">
                <p className="text-lg font-medium tracking-tight">{label}</p>
                <p className="home-secondary mt-2 text-sm leading-6 max-w-48">{caption}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
