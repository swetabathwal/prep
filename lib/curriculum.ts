/**
 * The 24-week curriculum. Everything here is static content — only progress
 * against it lives in the database, keyed by the ids below.
 */

export interface Pillar {
  key: string;
  name: string;
  weight: number;
  color: string;
}

export const PILLARS: Pillar[] = [
  { key: "fund", name: "JS/TS Fundamentals", weight: 18, color: "#c8613a" },
  { key: "ang", name: "Angular Depth", weight: 16, color: "#a4374a" },
  { key: "react", name: "React / Next.js", weight: 12, color: "#2f6f9e" },
  { key: "fsd", name: "System Design", weight: 15, color: "#6d5296" },
  { key: "dsa", name: "DSA", weight: 15, color: "#3f7d5c" },
  { key: "ai", name: "AI Engineering", weight: 6, color: "#1f7f86" },
  { key: "be", name: "Backend & Data", weight: 4, color: "#8a6a3d" },
  { key: "intv", name: "Interview Assets", weight: 6, color: "#b0473f" },
  { key: "proj", name: "Projects", weight: 8, color: "#4a5a7a" },
];

export const pillar = (k: string) => PILLARS.find((p) => p.key === k)!;

export interface Item {
  label: string;
  hint?: string;
}
export interface Module {
  id: string;
  pillar: string;
  title: string;
  items: Item[];
}
export interface Phase {
  id: string;
  weeks: string;
  title: string;
  goal: string;
  color: string;
  modules: Module[];
}

const i = (label: string, hint?: string): Item => ({ label, hint });

export const PHASES: Phase[] = [
  {
    id: "p1",
    weeks: "Weeks 1–6",
    title: "Rebuild the Foundation",
    color: "#c8613a",
    goal: "Get back everything the AI was doing for you. By the end you can write any of these on a blank page with no autocomplete.",
    modules: [
      {
        id: "m1",
        pillar: "fund",
        title: "JavaScript Core Internals",
        items: [
          i("Execution context, scope chain, hoisting, TDZ"),
          i("Closures — solve 5 closure puzzles by hand", "loop+setTimeout, private counters, once(), module pattern, memory implications"),
          i("`this` binding: implicit, explicit, new, arrow, lost-this"),
          i("Prototypes, prototype chain, class desugaring, super"),
          i("Event loop: call stack, macrotask vs microtask, rAF ordering", "Be able to predict output of any setTimeout/Promise interleaving question"),
          i("Promises: states, chaining, error propagation, unhandled rejections"),
          i("async/await — sequential vs parallel, all / allSettled / race / any"),
          i("Generators, iterators, Symbol.iterator, async iterators"),
          i("ESM vs CJS, tree shaking, dynamic import, side effects"),
          i("Memory: GC, common leak patterns, WeakMap / WeakRef"),
          i("Immutability, structural sharing, reference vs value bugs"),
        ],
      },
      {
        id: "m2",
        pillar: "fund",
        title: "Write-From-Scratch Drills (the anti-AI muscle)",
        items: [
          i("debounce + throttle with leading/trailing options"),
          i("deepClone handling cycles, Map, Set, Date"),
          i("curry / partial / pipe / compose"),
          i("memoize with a custom cache-key resolver"),
          i("Polyfill map, filter, reduce, flat"),
          i("Polyfill call, apply, bind"),
          i("Promise.all and Promise.allSettled from scratch"),
          i("MyPromise — full then / catch / finally, thenable resolution"),
          i("EventEmitter: on / off / once / emit"),
          i("LRU cache, O(1), Map-based"),
          i("Retry with exponential backoff + jitter + abort"),
          i("Async task queue with concurrency limit"),
          i("Deep equality checker"),
          i("Mini virtual DOM + diff/patch"),
          i("Mini React: your own useState + useEffect"),
          i("Infinite scroll with IntersectionObserver, no library"),
          i("Typeahead with cancellation and race-condition safety"),
          i("Redo the whole list from blank at the end of Phase 1", "This is the real test. Time yourself."),
        ],
      },
      {
        id: "m3",
        pillar: "fund",
        title: "TypeScript Mastery",
        items: [
          i("Generics: constraints, defaults, inference sites"),
          i("Conditional types + infer"),
          i("Mapped types + key remapping with `as`"),
          i("Template literal types"),
          i("Discriminated unions + exhaustiveness with never"),
          i("Rebuild Partial, Pick, Omit, Record, ReturnType yourself"),
          i("Type guards, narrowing, assertion functions"),
          i("`satisfies`, const type params, readonly & as const"),
          i("Declaration merging, module augmentation, .d.ts files"),
          i("Every strict flag in tsconfig — know what each catches"),
          i("Build a fully typed generic API client", "Endpoint map → inferred request/response types, no `any`"),
        ],
      },
      {
        id: "m4",
        pillar: "fund",
        title: "Browser & Web Platform",
        items: [
          i("Critical rendering path; reflow vs repaint vs composite"),
          i("Layers, will-change, GPU compositing, jank debugging"),
          i("IntersectionObserver, MutationObserver, ResizeObserver"),
          i("Storage: cookies, localStorage, sessionStorage, IndexedDB — when each"),
          i("HTTP caching: Cache-Control, ETag, stale-while-revalidate"),
          i("CORS, preflight, credentials, common CORS errors"),
          i("Security: XSS (stored/reflected/DOM), CSRF, CSP, SameSite, clickjacking"),
          i("Service workers, PWA, offline strategies"),
          i("Web Workers, structured clone, transferables"),
          i("WebSocket vs SSE vs long polling — tradeoffs"),
          i("Core Web Vitals: LCP, INP, CLS — how each is measured and fixed"),
        ],
      },
      {
        id: "m5",
        pillar: "fund",
        title: "CSS & Accessibility",
        items: [
          i("Flexbox and Grid to the point of no guessing"),
          i("Specificity, cascade layers (@layer), :is / :where"),
          i("Container queries and :has()"),
          i("Custom properties, theming, dark mode strategy"),
          i("Fluid type with clamp(), logical properties"),
          i("Animation performance — what triggers layout vs composite"),
          i("ARIA roles, landmarks, live regions"),
          i("Keyboard navigation, focus management, focus trap"),
          i("WCAG 2.2 AA basics + contrast"),
          i("Test one real page with a screen reader end to end"),
        ],
      },
      {
        id: "m6",
        pillar: "dsa",
        title: "DSA from absolute zero (weeks 1–6)",
        items: [
          i("Accept that starting here is normal", "Frontend work does not teach DSA. Four years of shipping UI and never writing a BFS is the default, not a failure."),
          i("Big-O in plain terms: what O(n) vs O(n log n) vs O(n²) actually costs", "Don't memorise a table. Learn to count loops and recursive branches."),
          i("Space complexity, including the recursion call stack"),
          i("The JS toolkit you'll use in 90% of problems", "Array methods, Map, Set, object-as-hashmap. Know the complexity of push/shift/splice/indexOf."),
          i("How to read a problem: inputs, outputs, constraints, edge cases", "Constraints tell you the expected complexity. n ≤ 10⁵ means you cannot do O(n²)."),
          i("The brute-force-first method", "Always write the dumb solution out loud first, state its complexity, then optimise. Interviewers score this."),
          i("Recursion mental model: base case, state, trust the call", "Draw the tree on paper for 5 problems before writing any code."),
          i("Set up your practice loop", "25-min timer → if stuck, read the solution → understand fully → re-solve from blank 3 days later."),
          i("Start a mistake log", "One line per problem: what I missed. Re-read every Sunday. Worth more than 50 extra problems."),
          i("Finish the Arrays & Hashing topic"),
          i("Finish Two Pointers"),
          i("Finish Sliding Window"),
          i("Finish Stack"),
          i("Reach 32 problems at Solved or better"),
        ],
      },
    ],
  },
  {
    id: "p2",
    weeks: "Weeks 7–12",
    title: "Angular Senior Depth + DSA Core",
    color: "#a4374a",
    goal: "Become the Angular person who has actually caught up to v21 — zoneless, signals-first. Most haven't. Ship a design system as proof.",
    modules: [
      {
        id: "m7",
        pillar: "ang",
        title: "Angular 21 — Modern Core",
        items: [
          i("signal, computed, effect, untracked — and when effect is the wrong tool"),
          i("linkedSignal and resource() / rxResource()"),
          i("Zoneless change detection: why zone.js was dropped, what changes for you"),
          i("Signal inputs, output(), model() two-way binding"),
          i("New control flow @if / @for (with track) / @switch"),
          i("@defer deferrable views + all trigger types"),
          i("Standalone components — life without NgModules"),
          i("Signal Forms (experimental) vs Reactive Forms — know both, know the risk"),
          i("Angular Aria / headless accessible components"),
          i("Vitest as the new default test runner (Karma is gone)"),
          i("Migrate a zone-based app to zoneless — write up the steps", "This is a great interview story. Do it on a real repo."),
        ],
      },
      {
        id: "m8",
        pillar: "ang",
        title: "Angular Architecture & Performance",
        items: [
          i("DI deep: hierarchical injectors, InjectionToken, multi providers"),
          i("inject() patterns and functional guards/resolvers/interceptors"),
          i("Change detection internals: OnPush, markForCheck, the CD tree"),
          i("RxJS: switchMap vs mergeMap vs concatMap vs exhaustMap — say it cold"),
          i("Subjects, shareReplay, custom operators, error strategies"),
          i("Routing: lazy loading, preloading strategies, route-level providers"),
          i("State: NgRx vs SignalStore vs plain services — real tradeoffs"),
          i("SSR + hydration, incremental hydration"),
          i("Performance: virtual scroll, CDK, bundle budgets, source-map-explorer"),
          i("Micro-frontends / Module Federation — and when NOT to"),
          i("Nx monorepo, library boundaries, enforced dependency rules"),
          i("Testing: component harnesses, Vitest, Playwright E2E"),
        ],
      },
      {
        id: "m9",
        pillar: "dsa",
        title: "DSA — Core (weeks 7–12)",
        items: [
          i("Recursion drills until it stops feeling like magic", "If recursion is still uncomfortable, stay here. Trees, graphs, backtracking and DP are all recursion wearing a hat."),
          i("Sorting: implement merge sort and quick sort from scratch"),
          i("Binary search — and the off-by-one template you'll reuse forever"),
          i("Finish Binary Search topic"),
          i("Finish Linked List topic"),
          i("Binary trees: all traversals (recursive AND iterative)"),
          i("Finish Trees topic"),
          i("Reach 90 problems at Solved or better"),
        ],
      },
    ],
  },
  {
    id: "p3",
    weeks: "Weeks 13–18",
    title: "React/Next + Frontend System Design",
    color: "#6d5296",
    goal: "Double your job pool with credible React, and learn the round that cuts most senior candidates.",
    modules: [
      {
        id: "m10",
        pillar: "react",
        title: "React 19",
        items: [
          i("All hooks + rules of hooks + writing custom hooks"),
          i("Reconciliation, keys, fiber intuition"),
          i("React Compiler 1.0 — what it auto-memoizes, what it doesn't"),
          i("Server Components: 'use client' / 'use server' boundary"),
          i("use() hook, Suspense, streaming SSR"),
          i("Actions, useActionState, useOptimistic, useFormStatus"),
          i("Error boundaries, useTransition, useDeferredValue"),
          i("Context vs Zustand vs Redux Toolkit — pick and defend"),
          i("TanStack Query: cache keys, invalidation, optimistic updates"),
          i("Profiling with React DevTools; fixing a real slow render"),
          i("Map every Angular concept to its React equivalent", "Interviewers love this. It proves you understand principles, not syntax."),
        ],
      },
      {
        id: "m11",
        pillar: "react",
        title: "Next.js App Router",
        items: [
          i("Routing, layouts, templates, parallel & intercepting routes"),
          i("Caching layers and 'use cache'"),
          i("Server actions and mutations"),
          i("Streaming + loading.tsx + Suspense boundaries"),
          i("Route handlers, middleware, edge runtime"),
          i("Image & font optimization"),
          i("Auth patterns in App Router"),
          i("ISR, revalidation, deployment"),
        ],
      },
      {
        id: "m12",
        pillar: "fsd",
        title: "Frontend System Design",
        items: [
          i("Learn and drill the RADIO framework until it's automatic"),
          i("Component architecture & composition patterns"),
          i("Client data layer: normalization, cache, pagination (offset vs cursor)"),
          i("Rendering strategy: CSR / SSR / SSG / ISR / streaming — pick and justify"),
          i("Performance budgets, code splitting, preload/prefetch/preconnect"),
          i("Core Web Vitals in practice: diagnose and fix a real LCP and INP problem"),
          i("List virtualization at 100k rows"),
          i("Real-time: WebSocket/SSE, reconnection, backpressure, ordering"),
          i("Offline-first, optimistic UI, conflict resolution (LWW vs CRDT)"),
          i("Design systems: tokens, theming, versioning, adoption across teams"),
          i("i18n / l10n, RTL, locale-aware formatting"),
          i("Observability: RUM, error tracking, feature flags, A/B"),
          i("Micro-frontends: honest tradeoffs, when it's a mistake"),
          i("Security at the architecture level: token storage, CSP, supply chain"),
          i("Practice all 12 problems on the System Design page"),
        ],
      },
      {
        id: "m13",
        pillar: "dsa",
        title: "DSA — Advanced (weeks 13–18)",
        items: [
          i("Finish Tries"),
          i("Finish Heap / PQ"),
          i("Finish Backtracking"),
          i("Finish Graphs"),
          i("Finish Advanced Graphs"),
          i("Finish 1-D DP"),
          i("Finish 2-D DP"),
          i("Timed mixed sets: 3 unseen problems in 75 min", "The real interview simulation. Do it weekly from week 16."),
          i("Reach 145 problems at Solved or better"),
        ],
      },
    ],
  },
  {
    id: "p4",
    weeks: "Weeks 19–24",
    title: "AI Engineering + Interview Machine",
    color: "#1f7f86",
    goal: "Add the 2026 premium skill, then turn everything into offers.",
    modules: [
      {
        id: "m14",
        pillar: "ai",
        title: "AI Engineering for Frontend",
        items: [
          i("LLM basics you must be able to explain: tokens, context window, temperature, cost per call"),
          i("Prompt engineering + structured outputs / JSON schema"),
          i("Streaming responses: SSE, token-by-token rendering, cancellation"),
          i("Build a chat UI: history, regenerate, stop, citations, error states"),
          i("Vercel AI SDK (and the Angular equivalent path)"),
          i("Embeddings + vector store + a working RAG pipeline"),
          i("Function / tool calling and a simple agent loop"),
          i("MCP (Model Context Protocol) — what it is and why it matters"),
          i("Evals, guardrails, graceful fallback when the model service is down", "Half of senior loops now touch this. It's a systems question, not an ML one."),
          i("Latency and cost optimization: caching, streaming, model routing"),
          i("Write your position on AI-assisted development", "You WILL be asked. Have a mature, specific answer — not 'I use Copilot'."),
        ],
      },
      {
        id: "m15",
        pillar: "be",
        title: "Backend & Data (enough to not be a liability)",
        items: [
          i("REST design: resources, status codes, idempotency, versioning"),
          i("GraphQL basics and when it's the wrong choice"),
          i("Build one real API — NestJS or Express, typed end to end"),
          i("SQL: joins, indexes, EXPLAIN, and the N+1 problem"),
          i("Postgres schema design + migrations", "You already did some of this building this app — write up what you learned."),
          i("Auth: sessions vs JWT, OAuth flow, refresh rotation, token storage"),
          i("Caching with Redis; cache invalidation strategies"),
          i("Docker basics + a CI/CD pipeline you wrote yourself"),
        ],
      },
      {
        id: "m16",
        pillar: "intv",
        title: "Interview Assets",
        items: [
          i("Resume rewritten: one page, impact + metrics, no responsibility lists", "Every bullet: action → tech → measurable outcome."),
          i("LinkedIn: headline, About, Featured, open-to-work recruiters-only"),
          i("GitHub cleaned, 3 repos pinned, each with a real README + live link"),
          i("Portfolio site live with the three projects and write-ups"),
          i("12 STAR stories written out", "conflict · failure · leadership · ownership · mentoring · ambiguity · deadline · disagreement · scale · incident · influencing without authority · biggest learning"),
          i("Your 'why senior' narrative — scope evidence, not years"),
          i("5 mock DSA interviews (with a human or Pramp/Exponent)"),
          i("5 mock frontend system design interviews"),
          i("3 behavioral mocks"),
          i("Negotiation script written + walk-away number decided"),
          i("Referral outreach list: 30 named people, personalised messages"),
          i("Company research template + 5 questions to ask each interviewer"),
        ],
      },
    ],
  },
];

/* ─────────────────────────── System design ─────────────────────────── */

export const FSD_STATUS = ["Not started", "Practised once", "Can teach it"] as const;

export const FSD_PROBLEMS: { title: string; tests: string }[] = [
  { title: "Autocomplete / typeahead", tests: "Debounce, cancellation, caching, keyboard a11y, race conditions" },
  { title: "Infinite news feed", tests: "Virtualization, pagination, optimistic actions, media loading, scroll restore" },
  { title: "Chat application", tests: "WebSocket, ordering, delivery states, offline queue, unread counts" },
  { title: "Collaborative doc editor", tests: "OT vs CRDT, presence, conflict resolution, cursor sync" },
  { title: "E-commerce PDP + cart", tests: "SSR/SEO, image strategy, cart persistence, variant state, checkout" },
  { title: "Analytics dashboard", tests: "Widget architecture, data fetching, charts perf, filters, export" },
  { title: "Video player", tests: "Adaptive streaming, buffering, custom controls, captions, a11y" },
  { title: "File uploader", tests: "Chunked + resumable, progress, retry, parallelism, validation" },
  { title: "Kanban board", tests: "Drag & drop a11y, optimistic reorder, realtime multi-user" },
  { title: "Photo gallery / lightbox", tests: "Lazy loading, responsive images, LCP, keyboard nav, prefetch" },
  { title: "Design system architecture", tests: "Tokens, theming, versioning, docs, adoption, breaking changes" },
  { title: "AI chat interface", tests: "Token streaming, stop/regenerate, citations, cost, fallback on model failure" },
];

export const RADIO = [
  ["Requirements (5 min)", "Functional, non-functional, scale, devices, offline?, real-time?, SEO?"],
  ["Architecture (8 min)", "Component tree, boundaries, server vs client, module ownership"],
  ["Data model (7 min)", "Entities, normalization, client cache shape, pagination strategy"],
  ["Interface / API (7 min)", "Endpoints or GraphQL, payload shape, error contract, optimistic updates"],
  ["Optimizations (15 min)", "Bundle splitting, virtualization, Core Web Vitals, caching, a11y, i18n, error states, observability, security"],
  ["Tradeoffs (3 min)", "Say what you'd give up and why. This is the part that reads as senior."],
];

/* ─────────────────────────── Projects ─────────────────────────── */

export interface Project {
  id: string;
  title: string;
  weeks: string;
  pillar: string;
  why: string;
  items: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "pr1",
    title: "Angular 21 Design System",
    weeks: "Weeks 7–12",
    pillar: "ang",
    why: "Design-system ownership is the exact scope signal that separates ₹35L from ₹55L, and the strongest possible Angular differentiator right now.",
    items: [
      "Repo + Nx workspace + library boundaries",
      "20+ components, fully signals-based, zoneless",
      "WCAG 2.2 AA on every component, keyboard + screen reader tested",
      "Design tokens + theming + dark mode",
      "Storybook / docs site deployed",
      "Vitest unit tests, 80%+ meaningful coverage",
      "Playwright visual regression tests",
      "Published to npm with semantic versioning",
      "README with architecture decisions and tradeoffs",
      "A written migration guide: zone-based → zoneless",
    ],
  },
  {
    id: "pr2",
    title: "Prep OS — this app",
    weeks: "Weeks 13–18",
    pillar: "react",
    why: "You are already using it, which means you'll actually maintain it. Next.js 15 + Server Components + Postgres + RLS auth is a complete full-stack story, and 'I built the tool I used to prepare for this interview' is a genuinely memorable opening line.",
    items: [
      "Deployed and running on your own Supabase + Vercel",
      "Read every file and understand it — don't ship code you can't defend",
      "Add: mistake log with spaced-repetition resurfacing",
      "Add: charts (readiness over time, hours per week)",
      "Add: full-text search across all your notes",
      "Add: markdown rendering + code blocks in notes",
      "Add: keyboard shortcuts and command palette",
      "Add: PWA + offline support",
      "Get Lighthouse 95+ on mobile; LCP < 2.5s, INP < 200ms",
      "Write tests and a CI pipeline",
      "Write the README as an architecture decision record",
    ],
  },
  {
    id: "pr3",
    title: "AI-Powered Product",
    weeks: "Weeks 19–24",
    pillar: "ai",
    why: "Your portfolio centrepiece and your answer to 'what have you done with AI beyond using Copilot'.",
    items: [
      "A genuine use case, not a ChatGPT wrapper demo",
      "Token-streaming UI with stop and regenerate",
      "RAG: ingestion, chunking, embeddings, vector search, citations",
      "Tool/function calling with a visible agent trace",
      "Graceful degradation when the model API fails",
      "Rate limiting + cost tracking dashboard",
      "An eval suite — measure quality, don't vibe-check it",
      "Prompt versioning",
      "Deployed and publicly usable",
      "Blog post explaining the architecture",
    ],
  },
];

/* ─────────────────────────── Skill matrix ─────────────────────────── */

export const MATRIX: { skill: string; pillar: string }[] = [
  { skill: "JavaScript internals", pillar: "fund" },
  { skill: "TypeScript advanced types", pillar: "fund" },
  { skill: "Browser & web platform", pillar: "fund" },
  { skill: "CSS architecture", pillar: "fund" },
  { skill: "Accessibility", pillar: "fund" },
  { skill: "Angular signals & zoneless", pillar: "ang" },
  { skill: "RxJS", pillar: "ang" },
  { skill: "Angular architecture & DI", pillar: "ang" },
  { skill: "Angular performance", pillar: "ang" },
  { skill: "Micro-frontends", pillar: "ang" },
  { skill: "React 19 & hooks", pillar: "react" },
  { skill: "Server Components / Next.js", pillar: "react" },
  { skill: "Client state management", pillar: "react" },
  { skill: "Frontend system design", pillar: "fsd" },
  { skill: "Core Web Vitals & perf", pillar: "fsd" },
  { skill: "Real-time & offline", pillar: "fsd" },
  { skill: "Design systems", pillar: "fsd" },
  { skill: "DSA problem solving", pillar: "dsa" },
  { skill: "Complexity analysis", pillar: "dsa" },
  { skill: "LLM app patterns / RAG", pillar: "ai" },
  { skill: "Streaming AI UIs", pillar: "ai" },
  { skill: "API design", pillar: "be" },
  { skill: "SQL & data modelling", pillar: "be" },
  { skill: "CI/CD & Docker", pillar: "be" },
  { skill: "Behavioral / STAR stories", pillar: "intv" },
  { skill: "Salary negotiation", pillar: "intv" },
];

export const MATRIX_LEVELS = [
  "0 — never touched",
  "1 — with help",
  "2 — on my own",
  "3 — can teach it",
];

/* ─────────────────────────── Job search ─────────────────────────── */

export const STAGES = [
  "Researching",
  "Referral asked",
  "Applied",
  "Recruiter screen",
  "Tech round",
  "System design",
  "Hiring manager",
  "Offer",
  "Rejected",
];

export const TIERS = [
  {
    title: "Tier A — Product companies & GCCs",
    band: "₹28–42L",
    list: "Atlassian · Adobe · Walmart Global Tech · Salesforce · Intuit · Autodesk · Thoughtspot · Postman · Razorpay · CRED · Zeta · Groww · Zepto · Swiggy · Zomato · PhonePe · Navi · Meesho · Sprinklr",
    note: "Your main target. Best effort-to-outcome ratio. Frontend system design plus a design system project reads very strongly here.",
    minReadiness: 72,
  },
  {
    title: "Tier B — Well-funded startups (Series B–D)",
    band: "₹22–32L + ESOP",
    list: "Fintech, devtools and AI-native startups. Track recent funding on Entrackr / Inc42 and go straight to their careers page.",
    note: "Faster loops, less DSA, more 'can you ship'. Your projects matter most here. Check ESOP strike price and cliff carefully.",
    minReadiness: 60,
  },
  {
    title: "Tier C — Remote / international",
    band: "₹35–70L equivalent",
    list: "Wellfound · Otta · RemoteOK · WeWorkRemotely · Toptal · Turing · European product companies hiring IST-adjacent",
    note: "Lighter DSA, very heavy on portfolio and written communication. Your public GitHub is effectively the whole interview.",
    minReadiness: 60,
  },
  {
    title: "Tier D — Top-tier / FAANG",
    band: "₹40–60L+",
    list: "Google · Amazon · Microsoft · Meta · Uber · Airbnb · Rubrik · Databricks",
    note: "Only after 130+ problems and 10+ system design reps. Interview these LAST — rejection cooldown is 6–12 months, and you want other offers as leverage.",
    minReadiness: 85,
  },
];

export const NEGOTIATION = [
  ["Never say your current CTC first.", "Recruiters anchor on it. Say: “I'm targeting ₹__L fixed based on the market for this scope — happy to hear the band you have budgeted.”"],
  ["Anchor high but defensible.", "After this plan, 2.5–3× your current is not greedy for 4 years with a design system, an AI product and system design ability."],
  ["Get competing offers.", "One offer is a wish; two is leverage. Cluster interviews inside a 3-week window."],
  ["Split the ask.", "Fixed vs variable vs ESOP vs joining bonus. If fixed is capped, move the ask elsewhere."],
  ["Know your walk-away number before the call.", "Write it down. Below it you decline politely and keep interviewing."],
  ["Never accept on the call.", "“Thank you — can I come back to you by Thursday?” is always fine."],
];

/* ─────────────────────────── Misc reference ─────────────────────────── */

export const RAMP = [
  ["1–2", "3 / week", "Complexity, JS toolkit, first Easy problems", "Zero time pressure. Understanding beats speed."],
  ["3–4", "5 / week", "Arrays, hashing, two pointers", "Still mostly Easy. Start the mistake log."],
  ["5–6", "6 / week", "Sliding window, stack", "First Mediums appear. Expect to struggle — that's the point."],
  ["7–9", "8 / week", "Binary search, linked lists, recursion", "Recursion is the wall. Slow down here if needed."],
  ["10–12", "8 / week", "Trees, BFS/DFS", "Highest-frequency interview topic. Do not rush."],
  ["13–15", "9 / week", "Heaps, graphs, backtracking", "Mostly Medium now."],
  ["16–18", "9 / week", "DP, greedy, intervals", "Add one timed 3-problem set each week."],
  ["19–21", "8 / week", "Mixed timed sets, company-tagged", "Simulate the real thing."],
  ["22–24", "6 / week", "Re-solve everything in the mistake log", "Volume drops, retention matters."],
];

export const PATTERNS = [
  ["Two pointers", "Sorted array · pair/triplet sums · palindromes · in-place removal"],
  ["Sliding window", "'Longest / shortest / maximum substring or subarray with…'"],
  ["Hash map", "'Have I seen this before?' · counting · grouping · O(1) lookup"],
  ["Prefix sum", "Repeated range-sum queries · subarray sums"],
  ["Monotonic stack", "'Next greater / smaller element' · histogram-shaped problems"],
  ["Binary search", "Sorted input · 'minimise the maximum' · answer in a numeric range"],
  ["Fast & slow pointers", "Linked list cycles · finding the middle"],
  ["Tree DFS", "Path problems · anything needing information from below"],
  ["Tree / graph BFS", "Shortest path in an unweighted graph · level-by-level"],
  ["Backtracking", "'All combinations / permutations / subsets' · constraint puzzles"],
  ["Heap / top-K", "'K largest / smallest / most frequent' · streaming medians"],
  ["Union-find", "Connected components · cycle detection in undirected graphs"],
  ["1-D DP", "'How many ways' · 'min/max cost' over a sequence"],
  ["2-D DP", "Two sequences · grids · knapsack-shaped constraints"],
  ["Intervals", "Meeting rooms · merging · overlaps — always sort first"],
];

export const RESOURCES = [
  ["NeetCode.io roadmap", "Free. The visual dependency roadmap is the best starting point for a beginner — it tells you what to learn before what.", "https://neetcode.io/roadmap"],
  ["Striver's A2Z DSA Sheet", "Free, Indian, thorough, video for every problem. Best if you want structure and hand-holding.", "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2"],
  ["LeetCode Explore cards", "Free built-in tutorials. Do 'Arrays 101' and 'Recursion I' in week 1.", "https://leetcode.com/explore/"],
  ["VisuAlgo", "Watch algorithms animate. Genuinely useful when recursion or graphs won't click.", "https://visualgo.net"],
  ["GreatFrontEnd", "Frontend-specific system design and JS coding questions. The closest thing to a real FE interview bank.", "https://www.greatfrontend.com"],
];
