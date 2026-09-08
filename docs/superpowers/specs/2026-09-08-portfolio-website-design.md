# Portfolio Website Design Specification

**Owner:** Syed Aon Muhammad Kazmi  
**Date:** 2026-09-08  
**Status:** Design approved in conversation; specification ready for user review  
**Working title:** From Data to Products

## 1. Product Summary

Build a high-end personal portfolio that positions Syed Aon Muhammad Kazmi for **hybrid AI/Data + product/business opportunities**. The portfolio must demonstrate technical depth, product thinking, commercial awareness, and clear communication without reading like a student project list or a generic business-development profile.

The site should operate as three complementary discovery systems over the same canonical body of work:

1. **Visual discovery** — cinematic landing experience and interactive project demonstrations.
2. **Editorial discovery** — readable project case studies and technical/build-journal writing.
3. **Conversational discovery** — an evidence-grounded “Ask My Portfolio” assistant and semantic search.

The core positioning is:

> **From data to products — I build AI-driven systems with technical depth and business impact.**

Primary audience groups:

- AI/Data recruiters and technical hiring managers.
- Product companies and AI startups.
- Founders and prospective clients looking for technical/product capability.
- Business-development and solutions teams seeking someone who can bridge technical systems and commercial problems.

The portfolio must make sense to all four without becoming vague.

---

## 2. Product Goals

### 2.1 Primary goals

- Establish a coherent professional identity across AI, data, software, product, and business-development experience.
- Demonstrate engineering competence through real system behavior, architecture, technical decisions, and evidence rather than static skill claims.
- Surface the strongest work quickly for time-constrained recruiters.
- Make technical writing a first-class credibility signal.
- Provide an AI layer that helps visitors discover relevant evidence rather than acting as a generic chatbot.
- Convert interested visitors through obvious project, résumé, contact, and AI calls to action.
- Meet launch-quality expectations for SEO, mobile responsiveness, analytics, accessibility, performance, error handling, favicon identity, and custom 404 behavior.

### 2.2 Success criteria

A successful launch should allow a first-time visitor to answer within seconds:

- Who is Aon professionally?
- What kinds of systems does he build?
- Which projects prove his technical ability?
- Does he understand product/business problems as well as implementation?
- What should I click next if I am evaluating him for a role or project?

The site must remain useful even if AI, database search, animation, or other enhanced features are unavailable.

---

## 3. Positioning and Messaging

### 3.1 Identity

Primary category label:

**AI · Data · Product**

Primary hero statement:

**From data to products.**

Supporting message:

**I build AI-driven systems with technical depth and business impact — spanning intelligent automation, full-stack products, analytics, and product strategy.**

### 3.2 Messaging principles

Copy should:

- Lead with problems, systems, decisions, and outcomes.
- Avoid inflated “innovation” language without evidence.
- Avoid presenting a long chain of job titles in the hero.
- Avoid implying sole ownership of team projects.
- Separate verified facts from interpretation.
- Frame Business Development at SprintX as complementary product/business exposure rather than a departure from technical work.

### 3.3 CTA hierarchy

Primary site-wide CTA:

**Explore My Work**

Secondary CTA:

**Ask My Portfolio**

Tertiary utilities:

- View résumé
- Contact
- LinkedIn/GitHub

The primary and secondary CTAs should not compete visually with every utility action.

---

## 4. Information Architecture

### 4.1 Primary routes

```text
/
/projects
/projects/[slug]
/blog
/blog/[slug]
/about
/resume
/404
```

Generated/supporting routes:

```text
/sitemap.xml
/robots.txt
/rss.xml
```

### 4.2 Homepage sequence

1. **Hero / positioning**
2. **Selected Work**
3. **What I Bring — AI × Data × Product × Business**
4. **Experience**
5. **Ask My Portfolio**
6. **Writing / Build Journal**
7. **Beyond the Work**
8. **Final CTA / Contact**

### 4.3 Persistent navigation

Desktop:

`Work · Experience · Writing · About · Ask AI`

with a distinct **Contact** action.

Mobile uses a clean sheet/drawer. Essential actions must remain visible and touch-friendly.

---

## 5. Visual and Interaction System

The portfolio uses **one shared design system with three presentation modes**.

### 5.1 Mode A — Cinematic experimental

Used primarily for the hero/landing experience.

Characteristics:

- Large typographic statements.
- Spatial composition.
- Controlled scroll choreography.
- Data → AI → product → business storytelling.
- Stronger atmospheric depth in dark theme.
- Purposeful motion rather than decoration.

The hero should visually represent transformation:

```text
raw data → model/reasoning → product interface → business outcome
```

The core message and CTA must render before or independently of the heavier creative layer.

### 5.2 Mode B — Product-interface

Used for projects and the AI experience.

Characteristics:

- Interfaces that resemble real technical/product systems.
- Timelines, schedulers, pipelines, node graphs, dashboards, architecture surfaces, state transitions.
- Interactive previews demonstrate the underlying engineering concept instead of showing decorative cards.
- Hover interactions must have tap/keyboard equivalents.

### 5.3 Mode C — Editorial-tech

Used for blogs, case-study reading sections, and content-heavy areas.

Characteristics:

- Strong typographic hierarchy.
- Comfortable line length and spacing.
- Minimal distraction.
- Structured tables of contents, code blocks, diagrams, references, and related-content modules.
- Very restrained motion.

### 5.4 Shared design language

All three modes share:

- typography system,
- spacing scale,
- radius/border rules,
- iconography,
- accent logic,
- animation timing,
- focus states,
- color tokens,
- grid conventions.

This continuity prevents the site from feeling like three unrelated products.

### 5.5 Theme

The site supports **adaptive light and dark themes**.

Requirements:

- Respect system preference by default.
- Persist a manual user choice.
- Design both themes intentionally rather than applying simple inversion.
- Dark theme can carry more cinematic depth.
- Light theme can lean more editorial/analytical.
- Both themes must meet contrast requirements.

### 5.6 Motion rule

No animation is accepted unless it communicates at least one of:

- hierarchy,
- causality,
- state,
- progress,
- navigation,
- system behavior.

Reduced-motion users receive a composed, understandable alternative rather than an empty or broken scene.

---

## 6. Hero Experience

### 6.1 Content

Eyebrow:

**AI · Data · Product**

Headline:

**From data to products.**

Support:

**I build AI-driven systems with technical depth and business impact — spanning intelligent automation, full-stack products, analytics, and product strategy.**

Primary CTA:

**Explore My Work**

Secondary CTA:

**Ask My Portfolio**

Résumé is a tertiary action.

### 6.2 Interaction concept

A controlled visual system progressively assembles the chain:

```text
data → intelligence → product → impact
```

Potential behaviors include:

- a dataset resolving into structure,
- reasoning/model nodes activating,
- the system becoming a product surface,
- an outcome metric or business state appearing.

The experience should feel cinematic on capable desktop devices, but degrade to a lightweight vertical sequence on mobile and reduced-motion contexts.

---

## 7. Project Strategy

### 7.1 Three-tier hierarchy

#### Tier 1 — Flagship case studies

Full interactive story, architecture, engineering decisions, contribution boundaries, results, and supporting evidence.

Approved core flagships:

1. **AI-Powered University Timetable Scheduling & Teacher Assignment System**
2. **AI Video Generation Pipeline — Human-in-the-Loop**
3. **Multimodal AI Chatbot — AIML + Prolog + Neo4j + ESP32**

#### Tier 2 — Featured projects

Shorter visual case studies with enough technical/business context to be credible.

Current candidates:

- **Industrial IoT Sensor Analytics**
- **Business Intelligence Dashboard Suite / Superstore Dashboard**
- **E-commerce Analytics / Amazon account work**, if adequate artifacts and business-impact evidence are available.

#### Tier 3 — Lab / archive

Compact project records rather than homepage focal points.

Candidates:

- Customer Churn Analysis
- House Price Prediction
- Crop Recommendation Dashboard
- Credit Card Fraud Detection Dashboard
- smaller Python data-cleaning/visualization work
- isolated SQL/Neo4j exercises
- Prolog family-tree work
- smaller ESP32/sensor experiments

This classification can change after artifact verification, but only evidence-rich projects should be promoted.

### 7.2 GitHub project audit notes

A connected repository audit identified the following useful signals:

**Industrial IoT Sensor Analytics** is a strong Tier-2 candidate and potentially a future flagship. The repository documents an end-to-end multivariate time-series workflow covering data cleaning, denoising, device profiling and K-means clustering, rolling features, anomaly detection, health scoring, forecasting, and cross-device similarity. The repository also contains output artifacts and a notebook, which makes it substantially more defensible than a simple project card.

**BI Superstore Dashboard** is a credible analytics project because the repository contains an actual `.pbix` file and dashboard image in addition to documented KPI, geographic, product, and time analysis. It is suitable for a Featured analytics slot.

**BI Crop Recommendation Dashboard** also contains a `.pbix` file and screenshot. It is useful as domain variety, but is better as secondary/archive material unless it can be tied to a stronger product or decision-making story.

**Credit Card Fraud Detection Dashboard** currently has only a README and dashboard image in the connected repository; the README references a PBIX file that is not present. Until source artifacts or stronger modelling evidence are supplied, it should not be presented as a major ML project or flagship case study.

**TunTun AI Chatbot** has a substantive Python codebase with AIML assets, Prolog rules, Neo4j integration code, templates, and a large main orchestrator. This supports keeping the multimodal/hybrid AI chatbot as a flagship, while the portfolio copy should distinguish repository-verified components from extra hardware/deployment details sourced from the résumé or project documentation.

### 7.3 Case-study structure

Every flagship uses the same information backbone while receiving its own visual treatment:

```text
Overview
↓
The Problem
↓
Why It Was Difficult
↓
System / Architecture
↓
My Contribution
↓
Engineering Decisions
↓
Interactive Demonstration
↓
Technology
↓
Results / Metrics
↓
What I Learned
↓
Source / Demo / Related Writing
```

### 7.4 Contribution integrity

For team projects, the portfolio must explicitly separate:

- what the overall team built,
- what Aon personally owned,
- what he led,
- what he integrated,
- what metrics belong to the overall system rather than his individual work.

For the university scheduler, present his role as **Full-Stack Integration Lead** on a four-person team, with particular ownership around electives scheduling, API/integration work, export/deployment, and related delivery as supported by source materials.

### 7.5 Flagship interaction concepts

**University Timetable System**  
Show constraint inputs, conflicts resolving, CP-SAT scheduling progress, capacity/schedule states, and timetable output.

**AI Video Pipeline**  
Show script → scene planning → model generation → human validation checkpoints → FFmpeg/render output.

**Multimodal AI Chatbot**  
Show AIML, Prolog, Neo4j, memory, and sensor inputs as connected reasoning/memory channels rather than a generic chat window.

**Industrial IoT Sensor Analytics**  
Potential featured interaction: raw sensor streams → cleaning/denoising → anomaly states → health score → forecast/similarity graph.

---

## 8. Experience Strategy

The experience section should communicate progression rather than just chronology.

Current ordering:

1. **Business Developer — SprintX — Present**
2. **Data Researcher — WebForest**
3. **Teaching Assistant — Department of AI, UMT**
4. Earlier commercial/operations experience such as Amazon account management and hotel management.

The narrative should show a trajectory across:

```text
business/operations exposure
→ data and analytics
→ AI/software systems
→ product/business development
```

SprintX is now the current top experience. The exact start date and exact responsibilities must be supplied and verified before launch; the site must not invent client work, sales metrics, pipeline figures, responsibilities, or outcomes.

---

## 9. Blog and Build-Journal Strategy

### 9.1 Editorial direction

Approved option: **Technical + Build Journal**.

Two primary content groups:

**Technical**

- AI
- Machine Learning
- Data Science
- Analytics
- Engineering

**Build Journal**

- portfolio architecture
- project retrospectives
- AI experiments
- deployment lessons
- product decisions
- implementation trade-offs
- lessons learned

### 9.2 Launch curation

Feature the strongest 6–8 existing articles rather than publishing the entire previous archive indiscriminately.

Recommended eight for launch:

1. **Data Preprocessing: A Guide to Cleaning Your Data**
2. **From Data to Insights: How Data Science Solves Business Problems**
3. **How Data Visualization Enhances Decision Making**
4. **The Ethics of Data Science: Responsibilities of a Data Scientist**
5. **Supervised vs. Unsupervised Learning: Key Differences**
6. **How to Build a Simple Machine Learning Model in Python**
7. **The Role of Statistics in Data Science**
8. **Deep Learning vs. Machine Learning: What’s the Difference?**

Preserve but do not feature at launch:

- Who is a Data Scientist and What Are Their Duties?
- The Journey to Becoming a Data Scientist: Tips for Beginners
- Python vs. R: Choosing the Right Tool for Data Science
- 5 Real-World Applications of Data Science in 2025
- Why Portfolio is Necessary?

### 9.3 Migration rules

- Preserve original authorship and core content.
- Clean index-level typos and duplicated listings deliberately rather than silently.
- Do not rewrite a dated article into a newer year without explicitly creating an updated edition.
- Preserve recognizable old slugs where sensible.
- Add canonical metadata, reading time, tags, table of contents where appropriate, code formatting, related content, Article structured data, and social preview images.
- Convert articles to repository-based MDX for launch rather than introducing a CMS immediately.

### 9.4 Interactive editorial components

Use interaction only when it materially teaches the article topic.

Examples:

- statistics → interactive distribution visualization,
- supervised vs. unsupervised → classification/clustering comparison,
- preprocessing → before/after dataset transformation,
- ML model tutorial → training pipeline visualization.

Reading remains the priority.

### 9.5 Future build-journal opportunity

The older “Why Portfolio is Necessary?” topic can evolve into a stronger article such as:

**Why I Rebuilt My Portfolio as an AI Product**

covering architecture, retrieval, interactive typography/layout experiments, performance, deployment, accessibility, and product decisions.

---

## 10. Ask My Portfolio

### 10.1 Purpose

The AI assistant is a **portfolio navigation and evidence layer**, not a generic floating chatbot.

It should help visitors answer questions such as:

- Which project best demonstrates AI engineering?
- What backend/full-stack work has Aon done?
- What business experience does he have?
- Summarize him for an AI Product role.
- Explain the timetable architecture.
- What has he written about machine learning?

### 10.2 Retrieval architecture

Use a hybrid model:

1. **Structured data** for exact facts.
2. **Semantic retrieval** for long-form project/blog content.
3. **Page context** to prioritize the currently viewed project/article.

Conceptual flow:

```text
Question
↓
Intent / query analysis
↓
Structured profile data + semantic search + current-page context
↓
Relevant evidence
↓
LLM
↓
Answer + evidence links + next actions
```

### 10.3 Structured knowledge

Exact fields include:

- name,
- current role,
- experience dates,
- education,
- certifications,
- skills,
- project metadata,
- project role/contribution,
- technologies,
- verified metrics,
- canonical links.

### 10.4 Semantic knowledge

Long-form retrieval covers:

- project case studies,
- architecture explanations,
- engineering decisions,
- blog articles,
- build-journal entries,
- relevant personal-statement material,
- lessons learned.

### 10.5 Trust and grounding

The assistant must:

- answer from portfolio evidence,
- distinguish facts from interpretation,
- avoid inventing employers, responsibilities, technologies, outcomes, or metrics,
- say when evidence is insufficient,
- expose useful source links back to projects/articles/experience.

### 10.6 Recruiter mode

Recruiter mode is a mode inside the assistant, not a separate product.

Useful prompt categories:

- role-fit summary,
- evidence for a skill,
- project comparison,
- interview questions,
- technical vs. business capability summary.

### 10.7 Page-aware behavior

On project pages, suggested prompts should prioritize that project first. On article pages, suggested prompts should prioritize the article while allowing cross-project comparisons.

### 10.8 Privacy

Do not store full visitor conversations by default.

Analytics can record aggregate interaction events, but raw prompts should not be sent to analytics by default.

---

## 11. Unified Search

Site search and AI retrieval should share the same canonical content model.

A query such as `Neo4j` should be able to return:

- matching flagship project,
- skill/certification context,
- relevant article if present,
- suggested AI question.

Search must support ordinary keyboard-based navigation independently of the conversational AI layer.

---

## 12. Content and Data Architecture

### 12.1 Canonical source

Use repository content as the canonical source for conventional portfolio information.

Suggested structure:

```text
content/
├── projects/
├── blog/
└── experience/
```

MDX is preferred for project case studies and articles because it allows semantic content, code, diagrams, and interactive React components without requiring a CMS at launch.

### 12.2 Search index

Conceptual ingestion flow:

```text
Repository / MDX
↓
Canonical content parser
↓
Chunking / metadata preparation
↓
Embedding generation
↓
MongoDB Atlas
├── content text
├── metadata
├── content type
├── slug
└── embedding/vector field
```

Embeddings are generated during ingestion/update workflows, not per page request.

### 12.3 Graceful independence

If AI or MongoDB is unavailable:

- normal project pages still render,
- normal blog pages still render,
- conventional navigation/search fallback remains usable where possible,
- contact and résumé remain accessible.

---

## 13. Technical Stack

Approved baseline:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Motion**
- **Next.js Route Handlers / Server Actions**
- **MongoDB Atlas**
- MongoDB driver or Mongoose where justified
- **MongoDB Vector Search**
- **Vercel AI SDK + selected model provider**
- **Resend**
- **Vercel**
- **GitHub**
- **Vercel Analytics**
- Next.js metadata APIs + JSON-LD

Do not add a separate long-lived Express deployment unless a concrete requirement later justifies it.

### 13.1 Pretext integration

`@chenglou/pretext` is approved only as a **selective client-side enhancement**.

Potential use cases:

- AI message geometry / advanced chat virtualization,
- adaptive hero text around controlled obstacles,
- selective editorial/project layout calculations,
- experimental project explorer layout.

Rules:

- semantic DOM remains the primary text output,
- do not paint core content to Canvas just because Pretext supports manual layout,
- isolate Pretext behind adapter hooks/components,
- do not call browser measurement APIs during ordinary Node server rendering,
- do not make the rest of the site depend on Pretext API stability.

Potential adapter boundary:

```text
lib/pretext/
components/interactive/
```

### 13.2 Custom development skills

The user has indicated custom development skills named `web-artifacts-builder` and `front-end`. They should be incorporated when they are surfaced by the active implementation environment. Their contents are not assumed in this specification.

---

## 14. Proposed Repository Structure

```text
portfolio/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── projects/
│   │   └── [slug]/
│   ├── blog/
│   │   └── [slug]/
│   ├── api/
│   │   ├── chat/
│   │   └── contact/
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   ├── error.tsx
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── sections/
│   ├── projects/
│   ├── blog/
│   ├── ai/
│   └── interactive/
├── content/
│   ├── projects/
│   ├── blog/
│   └── experience/
├── lib/
│   ├── ai/
│   ├── content/
│   ├── db/
│   ├── pretext/
│   ├── analytics/
│   └── utils/
├── public/
│   ├── images/
│   ├── icons/
│   └── resume/
├── types/
└── tests/
```

Exact filenames can change during implementation planning; the boundary intent should remain.

---

## 15. SEO and Metadata

### 15.1 Page-level metadata

Every public page receives a deliberate title and description.

Examples:

```text
Home
Syed Aon Muhammad Kazmi — AI, Data & Product

Project
AI-Powered University Timetable System | Aon Kazmi

Article
Data Preprocessing: A Guide to Cleaning Your Data | Aon Kazmi
```

### 15.2 Metadata requirements

- unique title and description,
- canonical URL,
- Open Graph metadata,
- Twitter/social-card metadata,
- purpose-built social preview images,
- structured data where appropriate,
- generated sitemap,
- robots directives,
- RSS feed for writing.

### 15.3 Structured data

Use relevant JSON-LD types such as:

- `Person`
- `Article`
- `BreadcrumbList`
- appropriate project/work representation where schema semantics are valid

Do not add schema solely for keyword stuffing.

---

## 16. Analytics

Use Vercel Analytics for baseline traffic/performance signals plus meaningful portfolio events.

Core custom events:

```text
project_opened
project_demo_interacted
project_source_clicked

blog_opened
blog_related_project_clicked

ai_opened
ai_question_submitted
ai_reference_clicked

resume_viewed
resume_downloaded

contact_started
contact_submitted

outbound_link_clicked
```

Useful non-sensitive properties can include project slug, article slug, CTA location, and referrer category.

Do not instrument every hover or decorative interaction. Do not send raw AI question text to analytics by default.

---

## 17. Accessibility

Target **WCAG 2.2 AA**.

Accessibility requirements:

- semantic HTML,
- correct heading hierarchy,
- keyboard-complete navigation,
- visible focus states,
- skip navigation,
- adequate contrast in both themes,
- sufficient touch targets,
- form labels and accessible validation,
- accessible dialogs/sheets,
- `prefers-reduced-motion` support,
- meaningful alt text for informational images,
- empty alt text for decorative imagery,
- screen-reader-safe AI streaming behavior,
- real links for AI/project references.

Interactive diagrams must have equivalent text representations. No critical content may be discoverable only through animation, hover, color, or pointer movement.

---

## 18. Mobile and Responsive Behavior

The site is mobile-first even though the desktop experience can be highly cinematic.

Requirements:

- no essential hover-only interactions,
- project demos translate to tap/scroll states,
- cinematic hero becomes a lighter controlled sequence,
- AI remains usable with one-handed touch input,
- navigation becomes a clean sheet/drawer,
- blog reading remains conventional and fast,
- no horizontal overflow in code, diagrams, cards, or media,
- layout and copy must remain understandable at small widths.

---

## 19. Performance

### 19.1 Core Web Vitals targets

Working performance targets:

```text
LCP ≤ 2.5 s
INP ≤ 200 ms
CLS ≤ 0.1
```

Targets should be checked under realistic mobile/network conditions, not only local desktop development.

### 19.2 Loading strategy

```text
Initial response
↓
Semantic content + critical styles + primary CTA
↓
Core navigation usable
↓
Cinematic module loads if relevant/capable
↓
Project interaction modules load per section/page
↓
AI client loads when approached/opened
```

### 19.3 Performance rules

- Server Components by default where appropriate.
- Minimize client component scope.
- Split project-specific interactive code.
- Lazy-load heavy visualizations.
- Optimize images with responsive sizes and modern formats.
- Carefully load/subset fonts.
- Favor transform/opacity animation where practical.
- Avoid global Pretext or heavy visualization dependencies.
- Do not make the user download every project demo on the homepage.
- AI should not materially increase the initial homepage payload.

---

## 20. Error Handling and Graceful Degradation

The portfolio should fail in layers rather than failing as one application.

### 20.1 AI failure

Show a concise unavailable state and retain direct links to projects, writing, and contact.

### 20.2 Search/database failure

Core content and navigation continue working. If semantic search is unavailable, provide conventional browse paths.

### 20.3 Visualization failure

The project case-study text and static architecture explanation remain visible.

### 20.4 Motion disabled

The hero and project sections render composed static states that still communicate the same ideas.

### 20.5 Contact failure

Show a clear error and preserve direct email/contact methods.

### 20.6 Route-level states

Implement intentional:

- loading states,
- route errors,
- project/article not-found handling,
- global 404.

---

## 21. Favicon and Identity

Create a minimal identity system that works across:

- 16×16 favicon,
- browser tabs,
- mobile bookmarks,
- app/PWA icons if used,
- social previews,
- larger site mark.

Preferred conceptual direction:

**abstract AK / data-to-product mark**

Avoid generic brain, robot, graph-node, or `<AI>` symbols as the primary identity.

This is a lightweight identity exercise, not a separate full branding project.

---

## 22. Custom 404

The 404 should be memorable but immediately recoverable.

Suggested copy direction:

**404 — This route didn’t make it to production.**

Potential visual:

```text
request
  ↓
route
  ↓
?
```

Recovery actions:

- Go Home
- Explore Projects
- Ask My Portfolio

Do not sacrifice clarity for the joke/interaction.

---

## 23. Contact and Conversion

Final homepage CTA direction:

**Have a product, data problem, or AI idea worth building?**

Possible actions:

- Start a conversation
- Email
- LinkedIn
- View/download résumé

Contact submission uses a server-side route/action and Resend. Direct contact methods remain available if the form or provider fails.

---

## 24. Content Integrity Rules

Before launch:

- verify current SprintX start date and responsibilities,
- verify which WebForest role end date should be shown,
- verify every project metric and distinguish team vs. personal ownership,
- verify every public repository/source link,
- remove old placeholder text from project READMEs before linking them prominently if practical,
- do not call a BI dashboard an ML model unless modelling code/evidence supports that claim,
- verify whether ESP32/hardware and Flask deployment artifacts are available for the TunTun case study,
- verify AI Video Pipeline artifacts before presenting generated outputs as production evidence,
- preserve archived 2025 article dates rather than silently refreshing them.

---

## 25. Testing Strategy

### 25.1 Functional

- navigation and route tests,
- project/article rendering,
- theme persistence,
- contact success/failure,
- sitemap/robots/RSS generation,
- structured-content parsing,
- AI request handling,
- search results/deep links.

### 25.2 AI/RAG evaluation

Maintain a small deterministic evaluation set covering:

- current role,
- past roles,
- project technologies,
- personal contribution vs. team contribution,
- role-fit summaries,
- project comparisons,
- blog discovery,
- insufficient-evidence questions,
- citation/reference correctness.

The assistant should fail conservatively rather than hallucinating.

### 25.3 Accessibility

- automated a11y scanning,
- keyboard-only walkthrough,
- focus-order review,
- screen-reader spot checks,
- reduced-motion check,
- contrast/touch-target checks.

### 25.4 Responsive/browser

Verify on representative:

- phone,
- tablet,
- laptop,
- large desktop,
- current Chromium,
- Firefox,
- Safari/WebKit.

### 25.5 Performance

- Lighthouse/Web Vitals review,
- bundle inspection,
- image/font audit,
- project-demo lazy-loading verification,
- AI bundle isolation verification.

---

## 26. Launch Quality Gates

The portfolio is not launch-ready until these are verified:

| Area | Launch requirement |
|---|---|
| CTA | Primary action obvious on desktop and mobile |
| Positioning | Hybrid AI/Data + product/business story is clear quickly |
| SEO | Unique metadata, canonicals, social previews, structured data |
| Indexing | Sitemap and robots validated |
| Blogs | Launch set migrated, metadata/links correct |
| Projects | Flagship contribution boundaries and evidence verified |
| Accessibility | Keyboard + automated + manual checks |
| Responsive | Phone, tablet, laptop, large desktop |
| Performance | Core Web Vitals/Lighthouse review |
| Images | Dimensions, responsive loading, alt decisions |
| AI | Grounding evaluation + failure handling |
| Search | Structured + semantic results validated |
| Analytics | Key conversion events verified |
| Contact | Success and failure paths tested |
| Links | Internal/outbound link audit |
| Errors | 404, route errors, API/network failures |
| Theme | Light, dark, system default |
| Motion | Full-motion + reduced-motion paths |
| Identity | Favicon/icons/social assets |
| Browser | Current Chromium, Firefox, Safari |
| Content | No placeholder or invented claims |

Final review perspectives:

1. **Technical recruiter**
2. **Product/business visitor**
3. **Founder/client**

Each perspective should find a clear value proposition and relevant evidence without requiring the same browsing path.

---

## 27. Explicit Non-Goals for Launch

To control scope, launch does **not** require:

- a general-purpose CMS,
- voice AI,
- storing full AI conversation histories,
- a separate Express backend,
- globally custom-rendered Canvas text,
- complex gamification,
- excessive cursor effects/particles,
- interactive demos for every old academic exercise,
- rewriting every archived blog before launch,
- a full standalone brand-identity project.

These can be revisited only if they create measurable portfolio value.

---

## 28. Known Content Gaps Before Implementation Completion

The design can proceed, but the following facts must be resolved before the related content is finalized:

- SprintX role start date.
- SprintX exact responsibilities and any approved public outcomes/metrics.
- WebForest end date if the role is no longer current.
- Final public résumé URL/file.
- Exact public links for the flagship timetable and AI Video projects, if available.
- Confirmation of which project screenshots/demos can be published.
- Verification of project metrics from authoritative project records.
- Final launch-domain choice.

These gaps are content inputs, not blockers for establishing the visual/technical foundation.

---

## 29. Design Decision Summary

The approved product direction is:

- Hybrid **AI/Data + product/business** positioning.
- Hero statement: **From data to products.**
- Cinematic hero, product-interface projects, editorial-tech blogs.
- Adaptive light and dark themes.
- Three-tier project hierarchy.
- Curated 6–8 article launch set with **Technical + Build Journal** direction.
- “Ask My Portfolio” as an evidence-grounded, page-aware assistant.
- Hybrid structured + semantic retrieval with MongoDB Atlas.
- Next.js/TypeScript/Tailwind/shadcn/Motion/Vercel stack.
- Selective client-side use of Pretext only where it provides measurable UX value.
- SEO, analytics, accessibility, mobile quality, performance, sitemap/robots, favicon, and 404 behavior treated as launch gates rather than post-build polish.

---

## 30. Approval Gate

This specification consolidates the design decisions approved in conversation.

**Next step after user review:** create a detailed implementation plan. Production implementation should not begin until this written specification is reviewed and approved.
