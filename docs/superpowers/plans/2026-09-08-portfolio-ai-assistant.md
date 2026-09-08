# Ask My Portfolio AI Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an evidence-grounded, page-aware portfolio assistant with hybrid structured + semantic retrieval, source links, recruiter mode, conservative failure behavior, and no raw prompt analytics by default.

**Architecture:** Keep canonical content in repository files. A separate ingestion command reads the existing typed records, chunks long-form bodies, generates embeddings, and upserts searchable documents to MongoDB Atlas. At request time, exact profile/project facts come from structured repository data while semantic evidence comes from Atlas vector search; the model receives only retrieved evidence plus current-page context and must return source-aware answers.

**Tech Stack:** Next.js Route Handlers, Vercel AI SDK (`ai`, `@ai-sdk/react`) with Vercel AI Gateway, MongoDB Node driver, MongoDB Atlas Vector Search, Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-08-portfolio-website-design.md`

## Global Constraints

- The assistant is a portfolio navigation/evidence layer, not a generic chatbot.
- Use structured data for exact facts and semantic retrieval for long-form content.
- Page context prioritizes the currently viewed project/article.
- Do not invent employers, responsibilities, technologies, outcomes, or metrics.
- Say when evidence is insufficient.
- Expose source links back to projects/articles/experience.
- Recruiter mode lives inside the assistant.
- Do not store full visitor conversations by default.
- Do not send raw prompts to analytics by default.
- If AI or MongoDB fails, conventional site content remains fully usable.
- AI code must not materially increase the initial homepage payload; lazy-load the client assistant.

---

## File Structure

```text
app/api/chat/route.ts
components/ai/
├── ask-portfolio.tsx
├── ai-message.tsx
├── evidence-links.tsx
└── recruiter-prompts.tsx
lib/ai/
├── model.ts
├── prompt.ts
├── retrieval.ts
├── structured-context.ts
└── schemas.ts
lib/db/
├── mongo.ts
└── vector-search.ts
scripts/
└── ingest-portfolio.ts
types/
└── ai.ts
tests/
├── unit/ai/
└── e2e/ai.spec.ts
```

### Task 1: Add AI/data dependencies and environment validation

**Files:**
- Modify: `package.json`
- Create: `lib/ai/env.ts`
- Create: `.env.example`
- Create: `tests/unit/ai/env.test.ts`

**Interfaces:**
- Produces validated `MONGODB_URI`, `MONGODB_DB`, `AI_GATEWAY_API_KEY`, `AI_CHAT_MODEL`, and `AI_EMBEDDING_MODEL` configuration.

- [ ] **Step 1: Install Vercel AI SDK, React bindings, MongoDB driver, and ingestion runner**

```bash
npm install ai @ai-sdk/react mongodb
npm install -D tsx
```

Use Vercel AI Gateway as the model access layer. The AI SDK accepts Gateway model strings for chat, and its `gateway.embeddingModel(...)` adapter is used for embeddings; no raw model HTTP endpoint is called.

- [ ] **Step 2: Write failing env tests**

Test that missing `MONGODB_URI` throws only when database functionality is invoked, not at module import for normal static page rendering. This preserves graceful independence.

- [ ] **Step 3: Implement lazy env readers**

Expose `getMongoEnv()` and `getAiEnv()` functions that validate required values with Zod when called.

- [ ] **Step 4: Add `.env.example`**

```text
MONGODB_URI=
MONGODB_DB=portfolio
AI_GATEWAY_API_KEY=
AI_CHAT_MODEL=openai/gpt-5.5
AI_EMBEDDING_MODEL=openai/text-embedding-3-small
NEXT_PUBLIC_SITE_URL=
```

No secret value is committed.

- [ ] **Step 5: Run/commit**

```bash
npm run test -- tests/unit/ai/env.test.ts
npm run typecheck
git add package.json package-lock.json lib/ai/env.ts .env.example tests/unit/ai/env.test.ts
git commit -m "chore: add ai and atlas configuration boundary"
```

### Task 2: Define evidence, chunk, and response schemas

**Files:**
- Create: `types/ai.ts`
- Create: `lib/ai/schemas.ts`
- Create: `tests/unit/ai/schemas.test.ts`

**Interfaces:**
- Produces:

```ts
type Evidence = {
  id: string;
  type: 'project' | 'blog' | 'experience' | 'profile';
  title: string;
  href: string;
  text: string;
  score?: number;
};

type PortfolioAnswer = {
  answer: string;
  evidence: Array<{ id: string; title: string; href: string }>;
  insufficientEvidence: boolean;
};
```

- [ ] **Step 1: Write schema tests**

Reject evidence links that are not internal portfolio paths or approved public source URLs and reject answers with evidence IDs not present in the supplied evidence set at response-validation time.

- [ ] **Step 2: Implement Zod schemas/types**

- [ ] **Step 3: Run/commit**

```bash
npm run test -- tests/unit/ai/schemas.test.ts
npm run typecheck
git add types/ai.ts lib/ai/schemas.ts tests/unit/ai/schemas.test.ts
git commit -m "feat: define portfolio ai evidence schemas"
```

### Task 3: Build deterministic structured context

**Files:**
- Create: `lib/ai/structured-context.ts`
- Create: `tests/unit/ai/structured-context.test.ts`

**Interfaces:**
- Produces: `buildStructuredContext(): Promise<Evidence[]>` and `matchStructuredEvidence(query: string, evidence: Evidence[]): Evidence[]`.

- [ ] **Step 1: Write factual retrieval tests**

Queries `current role`, `SprintX`, `Full-Stack Integration Lead`, `Neo4j`, and `Teaching Assistant` must return the corresponding structured evidence without an LLM.

- [ ] **Step 2: Implement from canonical loaders**

Map project metadata and experience into compact evidence records. SprintX evidence contains only company, role, and `Present` until the user supplies verified responsibilities/start date.

- [ ] **Step 3: Run/commit**

```bash
npm run test -- tests/unit/ai/structured-context.test.ts
npm run typecheck
git add lib/ai/structured-context.ts tests/unit/ai/structured-context.test.ts
git commit -m "feat: add deterministic structured portfolio evidence"
```

### Task 4: Build content chunking and ingestion records

**Files:**
- Create: `lib/ai/chunking.ts`
- Create: `scripts/ingest-portfolio.ts`
- Create: `tests/unit/ai/chunking.test.ts`

**Interfaces:**
- Produces `chunkContent(record, maxChars = 1800): PortfolioChunk[]` and ingestion records with stable IDs.

- [ ] **Step 1: Write chunking tests**

Verify paragraphs remain intact where possible, chunks retain source type/slug/href, and repeated ingestion of unchanged content produces identical IDs.

- [ ] **Step 2: Implement deterministic chunking**

Use paragraph boundaries and stable SHA-256 IDs derived from `type:slug:index:text`. Keep chunk size under 1800 characters unless a single paragraph exceeds the limit, then split that paragraph by sentence boundary.

- [ ] **Step 3: Implement ingestion command skeleton with dry-run**

`npm run ingest:portfolio -- --dry-run` loads projects/blogs/experience, creates chunks, prints counts by type, and performs no network writes. Add script:

```json
"ingest:portfolio": "tsx scripts/ingest-portfolio.ts"
```

- [ ] **Step 4: Run/commit**

```bash
npm run test -- tests/unit/ai/chunking.test.ts
npm run ingest:portfolio -- --dry-run
git add lib/ai/chunking.ts scripts/ingest-portfolio.ts package.json tests/unit/ai/chunking.test.ts
git commit -m "feat: add deterministic portfolio ingestion model"
```

### Task 5: Add MongoDB connection and vector-search adapter

**Files:**
- Create: `lib/db/mongo.ts`
- Create: `lib/db/vector-search.ts`
- Create: `tests/unit/ai/vector-search.test.ts`

**Interfaces:**
- Produces `upsertPortfolioChunks(chunks)` and `searchPortfolioVectors(embedding, options)`.

- [ ] **Step 1: Write adapter tests with mocked Mongo collection**

Verify upserts use stable `_id`, preserve `type`, `slug`, `href`, `text`, and `embedding`; verify search applies an optional `sourceSlug` filter before broader retrieval when page context is supplied.

- [ ] **Step 2: Implement cached Mongo client**

Use a module-level promise cache in server runtime. Do not initialize MongoDB in static content modules.

- [ ] **Step 3: Implement vector search behind one function**

Keep Atlas pipeline/index-name details in `lib/db/vector-search.ts` only. The rest of the app sees `Evidence[]`, allowing index changes without touching chat UI/routes.

- [ ] **Step 4: Run/commit**

```bash
npm run test -- tests/unit/ai/vector-search.test.ts
npm run typecheck
git add lib/db tests/unit/ai/vector-search.test.ts
git commit -m "feat: isolate atlas vector search adapter"
```

### Task 6: Integrate embedding generation into ingestion

**Files:**
- Create: `lib/ai/model.ts`
- Modify: `scripts/ingest-portfolio.ts`
- Create: `tests/unit/ai/model.test.ts`

**Interfaces:**
- Produces `embedTexts(texts: string[]): Promise<number[][]>` and `getChatModel()`.

- [ ] **Step 1: Write model-boundary tests with mocked provider**

Ensure ingestion batches embedding requests and never embeds already unchanged chunks when their stored `contentHash` matches.

- [ ] **Step 2: Implement provider adapter using the official AI SDK provider**

Keep model names in env/config, not scattered through components. If the provider is unavailable, ingestion exits with a non-zero status and no partial database swap.

- [ ] **Step 3: Implement safe upsert flow**

Generate all embeddings first, then upsert records. Add a `contentHash` and `updatedAt`. Do not delete records from the live index unless their source no longer exists and the ingestion run reached the reconciliation stage successfully.

- [ ] **Step 4: Run/commit**

```bash
npm run test -- tests/unit/ai/model.test.ts
npm run typecheck
git add lib/ai/model.ts scripts/ingest-portfolio.ts tests/unit/ai/model.test.ts
git commit -m "feat: embed and ingest portfolio knowledge"
```

### Task 7: Build hybrid retrieval with page-context priority

**Files:**
- Create: `lib/ai/retrieval.ts`
- Create: `tests/unit/ai/retrieval.test.ts`

**Interfaces:**
- Produces:

```ts
retrieveEvidence({
  query,
  pageContext,
  limit,
}: {
  query: string;
  pageContext?: { type: 'project' | 'blog'; slug: string };
  limit: number;
}): Promise<Evidence[]>
```

- [ ] **Step 1: Write retrieval-merging tests**

Verify exact structured evidence outranks weak semantic matches for current-role questions. Verify a scheduler page-context question puts scheduler chunks ahead of unrelated projects. Verify duplicate href/text evidence collapses.

- [ ] **Step 2: Implement hybrid merge**

Use structured token matching plus embedding/vector results. When page context exists, query that source first, then broaden only if fewer than the requested evidence count is returned.

- [ ] **Step 3: Run/commit**

```bash
npm run test -- tests/unit/ai/retrieval.test.ts
npm run typecheck
git add lib/ai/retrieval.ts tests/unit/ai/retrieval.test.ts
git commit -m "feat: add hybrid page-aware evidence retrieval"
```

### Task 8: Build grounded system prompt and chat route

**Files:**
- Create: `lib/ai/prompt.ts`
- Create: `app/api/chat/route.ts`
- Create: `tests/unit/ai/prompt.test.ts`
- Create: `tests/unit/ai/chat-route.test.ts`

**Interfaces:**
- POST body: `{ messages, pageContext?, mode?: 'default' | 'recruiter' }`.
- Response: AI SDK stream with final evidence metadata or structured response protocol supported by the installed current AI SDK.

- [ ] **Step 1: Write prompt-policy tests**

Assert system prompt includes: evidence-only instruction, no invented facts, insufficient-evidence behavior, separation of interpretation from fact, and source-link requirement.

- [ ] **Step 2: Implement route validation/rate bounds**

Use Zod to cap message count and message length. Reject empty final user prompts. Do not log raw message content.

- [ ] **Step 3: Retrieve evidence before model invocation**

If retrieval returns no evidence for a factual question, return a conservative answer without calling the model where possible. Otherwise pass only relevant evidence and explicit source IDs.

- [ ] **Step 4: Validate answer evidence references**

After model generation, ensure cited evidence IDs exist in the retrieved set. Drop unknown IDs and set `insufficientEvidence` when the model cannot substantiate a claim.

- [ ] **Step 5: Run/commit**

```bash
npm run test -- tests/unit/ai/prompt.test.ts tests/unit/ai/chat-route.test.ts
npm run typecheck
git add lib/ai app/api/chat tests/unit/ai
git commit -m "feat: add evidence-grounded portfolio chat route"
```

### Task 9: Build lazy-loaded Ask My Portfolio UI with evidence links

**Files:**
- Create: `components/ai/ask-portfolio.tsx`
- Create: `components/ai/ai-message.tsx`
- Create: `components/ai/evidence-links.tsx`
- Create: `components/ai/recruiter-prompts.tsx`
- Modify: `components/sections/*` Ask AI boundary
- Create: `tests/unit/ai/ask-portfolio.test.tsx`

**Interfaces:**
- Supports suggested prompts, recruiter mode, URL `?q=` hydration, page-context prop, source links, unavailable state.

- [ ] **Step 1: Write UI tests**

Verify suggested prompts are buttons, evidence is rendered as real links, error state retains project/blog navigation, and recruiter mode changes suggestions without hiding normal input.

- [ ] **Step 2: Implement lazy boundary**

Dynamically import the interactive assistant from the static section only when the section approaches viewport or after user activation. Preserve a normal link/button CTA before hydration.

- [ ] **Step 3: Implement accessible streaming**

Use one polite live region for completed/meaningful response updates rather than announcing every token. Keep focus in the input after submit unless the user explicitly moves it.

- [ ] **Step 4: Run/commit**

```bash
npm run test -- tests/unit/ai/ask-portfolio.test.tsx
npm run typecheck
git add components/ai components/sections tests/unit/ai/ask-portfolio.test.tsx
git commit -m "feat: add accessible ask-my-portfolio interface"
```

### Task 10: Add deterministic RAG evaluation suite

**Files:**
- Create: `tests/evals/portfolio-cases.ts`
- Create: `tests/evals/retrieval.test.ts`
- Create: `tests/e2e/ai.spec.ts`

**Interfaces:**
- Evaluation cases cover current role, past roles, project technologies, team/personal contribution, role fit, project comparison, blog discovery, insufficient evidence, evidence-link correctness.

- [ ] **Step 1: Add retrieval-only deterministic cases**

At minimum:

```ts
[
  ['What is Aon doing now?', ['SprintX']],
  ['Which project uses Neo4j?', ['multimodal-ai-chatbot']],
  ['What did Aon personally do on the scheduler?', ['university-timetable-system']],
  ['Has Aon led a billion-dollar acquisition?', []],
]
```

The unsupported claim case must return no supporting evidence and therefore force conservative behavior.

- [ ] **Step 2: Add browser fallback tests**

Mock `/api/chat` failure and assert normal project/blog links remain visible and usable.

- [ ] **Step 3: Run full AI gate**

```bash
npm run test
npm run test:e2e -- tests/e2e/ai.spec.ts
npm run typecheck
npm run lint
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add tests/evals tests/e2e/ai.spec.ts
git commit -m "test: add portfolio rag grounding evaluations"
```

## Plan Completion Gate

Before launch-hardening work:

- run ingestion against the configured Atlas development database,
- manually test at least 20 questions from recruiter/technical/product perspectives,
- confirm unsupported questions produce conservative answers,
- confirm raw prompts do not appear in analytics or server logs,
- verify page-aware prompts prefer current page evidence,
- verify the homepage's initial JavaScript remains materially unchanged until the AI section is activated.
