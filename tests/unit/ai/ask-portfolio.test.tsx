import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AskPortfolio } from "@/components/ai/ask-portfolio";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});
const answer = {
  answer: "**Plain** <script>text</script>",
  evidence: [
    {
      id: "p",
      title: "Scheduler",
      href: "/projects/university-timetable-system",
    },
  ],
  insufficientEvidence: false,
};
it("hydrates URL questions, supports recruiter buttons and sends standalone page-aware questions", async () => {
  window.history.replaceState({}, "", "/?q=Architecture");
  const fetcher = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => answer });
  vi.stubGlobal("fetch", fetcher);
  render(
    <AskPortfolio
      pageContext={{ type: "project", slug: "university-timetable-system" }}
    />,
  );
  const input = screen.getByRole("textbox", { name: "Your question" });
  expect(input).toHaveValue("Architecture");
  fireEvent.click(screen.getByRole("checkbox", { name: "Recruiter mode" }));
  fireEvent.click(
    screen.getByRole("button", {
      name: "Summarize Aon for an AI Product role.",
    }),
  );
  expect(input).toHaveFocus();
  fireEvent.submit(screen.getByRole("form", { name: "Ask My Portfolio" }));
  await screen.findByRole("link", { name: "Scheduler" });
  expect(fetcher).toHaveBeenCalledWith(
    "/api/chat",
    expect.objectContaining({
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Summarize Aon for an AI Product role." },
        ],
        mode: "recruiter",
        pageContext: { type: "project", slug: "university-timetable-system" },
      }),
    }),
  );
  expect(screen.getByRole("status")).toHaveTextContent(answer.answer);
  expect(screen.getAllByRole("status")).toHaveLength(1);
  expect(input).toHaveFocus();
  expect(screen.getByRole("link", { name: "Scheduler" })).toHaveAttribute(
    "href",
    answer.evidence[0].href,
  );
  expect(document.querySelector("script")).toBeNull();
});
it("shows pending state and preserves moved focus and navigation on unavailable responses", async () => {
  let finish!: (value: unknown) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    ),
  );
  render(<AskPortfolio />);
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Question" },
  });
  fireEvent.submit(screen.getByRole("form"));
  expect(screen.getByText("Finding portfolio evidence…")).toBeVisible();
  const browse = screen.getByRole("link", { name: "Browse projects" });
  browse.focus();
  finish({ ok: false, json: async () => answer });
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("unavailable"),
  );
  expect(browse).toHaveFocus();
  expect(screen.getByRole("link", { name: "Browse writing" })).toHaveAttribute(
    "href",
    "/blog",
  );
  expect(screen.queryByRole("link", { name: "Scheduler" })).toBeNull();
});
it("rejects malformed evidence links and renders no unsafe links", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...answer,
        evidence: [{ id: "x", title: "Unsafe", href: "javascript:alert(1)" }],
      }),
    }),
  );
  render(<AskPortfolio />);
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Question" },
  });
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("unavailable"),
  );
  expect(screen.queryByRole("link", { name: "Unsafe" })).toBeNull();
});
import { LazyAskPortfolio } from "@/components/ai/lazy-ask-portfolio";
it("keeps navigation and activation available until the interactive boundary is requested", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  // Older browsers without an observer still have explicit activation.
  delete (window as unknown as { IntersectionObserver?: unknown })
    .IntersectionObserver;
  render(<LazyAskPortfolio />);
  expect(screen.queryByRole("textbox")).toBeNull();
  const trigger = screen.getByRole("button", {
    name: "Open portfolio assistant",
  });
  trigger.focus();
  fireEvent.click(trigger);
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveFocus());
});
it("hydrates existing search-to-assistant fragment URLs without sending automatically", () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  window.history.replaceState({}, "", "/#ask-ai?q=Neo4j");
  render(<AskPortfolio />);
  expect(screen.getByRole("textbox")).toHaveValue("Neo4j");
  expect(fetcher).not.toHaveBeenCalled();
});
it("updates a mounted assistant when search navigation changes the fragment question", async () => {
  render(<AskPortfolio />);
  window.history.replaceState({}, "", "/#ask-ai?q=Current%20role");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.getByRole("textbox")).toHaveValue("Current role");
});
