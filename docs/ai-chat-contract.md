# Portfolio chat contract

`POST /api/chat` accepts JSON `{ messages: [{ role: 'user' | 'assistant', content: string }], pageContext?: { type: 'project' | 'blog', slug: string }, mode?: 'default' | 'recruiter' }`.

Messages contain 1–20 entries, each 1–4000 trimmed characters; the last entry must be a nonempty user question. The request body is limited to 100,000 bytes. Only the final question is used for retrieval and generation; previous messages are display history, never evidence. Task 9 should send standalone questions, including when following up, and plain string content rather than SDK UI-message parts.

The response is **completed JSON**, never an AI SDK UI-message stream. AI SDK 7 `generateText` with `Output.object` generates the structured object on the server. The client should use `fetch`, await `response.json()`, render `answer` as plain text, and render the separate `evidence` entries as links. Announce the completed answer once in a polite live region. This avoids showing generated text before grounding validation finishes.

200 returns `PortfolioAnswer`: `{ answer: string, evidence: [{ id, title, href }], insufficientEvidence: boolean }`. Insufficient retrieval, missing citations, altered/unknown citations, or an uncertainty flag returns a conservative answer with empty evidence, replacing all generated prose. Source IDs, titles, and hrefs must exactly match retrieved evidence. Answers cannot contain embedded links; source links are rendered separately.

400 (invalid body) and 413 (too large) return `{ error: string }`. 503 returns a safe `PortfolioAnswer` unavailable message. All responses use `Cache-Control: no-store`. The UI must check HTTP status, retain conventional project/blog navigation on errors, and avoid logging prompts or provider payloads. No conversations are persisted; SDK telemetry is disabled. Model generation has a 30-second timeout and no retries. Input bounds are resource bounds, not a distributed request-rate limiter.

Citation validation establishes source identity, not mathematical proof of every generated claim. Evidence-only instructions and conservative rejection reduce unsupported claims; live grounding evaluation remains a separate release gate.
