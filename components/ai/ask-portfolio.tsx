"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { portfolioAnswerSchema } from "@/lib/ai/schemas";
import type { PortfolioAnswer, PortfolioPageContext } from "@/types/ai";
import { AiMessage } from "./ai-message";
import { RecruiterPrompts } from "./recruiter-prompts";
const unavailable: PortfolioAnswer = {
  answer:
    "The portfolio assistant is unavailable right now. Please explore the projects and writing below, or try again later.",
  evidence: [],
  insufficientEvidence: true,
};
function initialQuestion() {
  if (typeof window === "undefined") return "";
  const search = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.split("?")[1];
  return (
    search.get("q") ??
    new URLSearchParams(hashQuery).get("q") ??
    ""
  ).slice(0, 4000);
}
export function AskPortfolio({
  pageContext,
  focusOnMount = false,
}: {
  pageContext?: PortfolioPageContext;
  focusOnMount?: boolean;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [recruiter, setRecruiter] = useState(false);
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState<PortfolioAnswer | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    const hydrate = () => {
      const value = initialQuestion();
      if (value) setQuestion(value);
    };
    window.addEventListener("hashchange", hydrate);
    window.addEventListener("popstate", hydrate);
    return () => {
      window.removeEventListener("hashchange", hydrate);
      window.removeEventListener("popstate", hydrate);
    };
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const content = question.trim();
    if (!content || inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setResponse(null);
    input.current?.focus();
    try {
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          messages: [{ role: "user", content }],
          mode: recruiter ? "recruiter" : "default",
          ...(pageContext ? { pageContext } : {}),
        }),
      });
      if (!result.ok) throw new Error("Unavailable");
      const parsed = portfolioAnswerSchema.safeParse(await result.json());
      setResponse(parsed.success ? parsed.data : unavailable);
    } catch {
      setResponse(unavailable);
    } finally {
      setPending(false);
      inFlight.current = false;
    }
  }
  return (
    <div>
      <p className="text-sm leading-6">
        Answers use portfolio evidence. Conversations are not saved.
      </p>
      <label className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={recruiter}
          onChange={(event) => setRecruiter(event.target.checked)}
        />
        Recruiter mode
      </label>
      <RecruiterPrompts
        recruiter={recruiter}
        pageContext={pageContext}
        onSelect={(prompt) => {
          setQuestion(prompt);
          input.current?.focus();
        }}
      />
      <form aria-label="Ask My Portfolio" onSubmit={submit}>
        <label htmlFor="portfolio-question" className="block font-medium">
          Your question
        </label>
        <textarea
          ref={input}
          id="portfolio-question"
          autoFocus={focusOnMount}
          value={question}
          maxLength={4000}
          required
          rows={3}
          onChange={(event) => setQuestion(event.target.value)}
          className="mt-2 w-full rounded border border-current bg-transparent p-3 focus-visible:outline-2 focus-visible:outline-offset-4"
        />
        <button
          type="submit"
          disabled={pending || !question.trim()}
          className="home-link mt-3 disabled:opacity-50"
        >
          Ask question
        </button>
        {pending && <p className="mt-3">Finding portfolio evidence…</p>}
      </form>
      <AiMessage response={response} />
      <nav aria-label="Explore portfolio" className="mt-6 flex flex-wrap gap-6">
        <Link href="/projects" className="home-link">
          Browse projects
        </Link>
        <Link href="/blog" className="home-link">
          Browse writing
        </Link>
      </nav>
    </div>
  );
}
