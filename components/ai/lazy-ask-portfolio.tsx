"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import type { PortfolioPageContext } from "@/types/ai";
type Props = { pageContext?: PortfolioPageContext; focusOnMount?: boolean };
let assistant: Promise<ComponentType<Props>> | undefined;
function loadAssistant() {
  return (assistant ??= import("./ask-portfolio")
    .then((module) => module.AskPortfolio)
    .catch((error) => {
      assistant = undefined;
      throw error;
    }));
}
export function LazyAskPortfolio({ pageContext }: Props) {
  const [Assistant, setAssistant] = useState<ComponentType<Props> | null>(null);
  const [failed, setFailed] = useState(false);
  const [activated, setActivated] = useState(false);
  const boundary = useRef<HTMLDivElement>(null);
  async function activate(focus: boolean) {
    if (focus) setActivated(true);
    try {
      const component = await loadAssistant();
      setAssistant(() => component);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  useEffect(() => {
    const handoff = () => {
      if (!/^#ask-ai(?:\?|$)/.test(window.location.hash)) return;
      boundary.current?.scrollIntoView({ block: "start" });
      void activate(true);
    };
    const frame = window.requestAnimationFrame(handoff);
    window.addEventListener("hashchange", handoff);
    window.addEventListener("popstate", handoff);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handoff);
      window.removeEventListener("popstate", handoff);
    };
  }, []);
  useEffect(() => {
    if (!boundary.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void activate(false);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(boundary.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={boundary}>
      {Assistant ? (
        <Assistant pageContext={pageContext} focusOnMount={activated} />
      ) : (
        <>
          <button
            type="button"
            className="home-link"
            onClick={() => void activate(true)}
          >
            Open portfolio assistant
          </button>
          {failed && (
            <p>The assistant could not load. Try again or browse below.</p>
          )}
          <div className="mt-6 flex gap-6">
            <Link href="/projects" className="home-link">
              Browse projects
            </Link>
            <Link href="/blog" className="home-link">
              Browse writing
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
