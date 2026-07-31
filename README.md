# Prep OS

A full-stack tracker for a 24-week senior frontend interview preparation plan.
Built with Next.js 15 (App Router, Server Components), Supabase Postgres, and
row-level-security auth.

This is also **Project #2 on your own roadmap**. Read the code before you extend it —
you'll be asked about it in interviews, and "I built the tool I used to prepare for
this interview" is a genuinely memorable opening line.

---

## What it does

| Page | What's in it |
|---|---|
| **Dashboard** | Weighted readiness score across 9 pillars, current phase, streak, session logging, the job-search gate |
| **Roadmap** | The full 24-week curriculum — 4 phases, 16 modules, ~150 checkable items |
| **DSA** | All 150 NeetCode problems with live LeetCode links, 4-state status per problem, the beginner ramp, the 15 patterns |
| **System Design** | 12 practice problems, RADIO framework, 3-state mastery tracking |
| **Projects** | 3 portfolio projects with milestone checklists |
| **Notes** | Every note you've written, searchable and filterable |
| **Jobs** | Locked until 60% readiness. Application pipeline, company tiers, salary bands, negotiation script |

**Notes attach to anything.** Every roadmap item, DSA problem, system design problem
and project milestone has a `+ note` button. That's the feature that turns this from a
checklist into a revision sheet.

---

## Setup — about an hour, all free tier

### 1. Install dependencies

```bash
cd prep-os      # wherever you put this folder
npm install
```

### 2. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `prep-os`, pick a region near you (Mumbai / Singapore for India)
3. Save the database password somewhere — you won't need it for this app, but you'll
   want it later
4. Wait ~2 minutes for it to provision

### 3. Create the tables

1. In your Supabase project → **SQL Editor** → **New query**
2. Open `supabase/schema.sql` from this repo, copy the whole file, paste it in
3. Click **Run**

You should see `Success. No rows returned`. That file creates five tables, turns on
row-level security, and adds a trigger that creates your settings row on signup.

> **Read this file.** It's the most interview-relevant part of the project — RLS
> policies, triggers, and a generic key/value progress table are all things you can be
> asked to explain.

### 4. Wire up the environment

```bash
cp .env.example .env.local
```

Then in Supabase → **Project Settings → API**, copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Leave `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for now.

> The anon key is safe to expose in the browser. It only works in combination with the
> RLS policies you just created — that's the whole point of RLS. The `service_role` key
> is the dangerous one; this app never uses it.

### 5. Turn on email sign-in

Supabase → **Authentication → Providers → Email**:

- **Enable email provider**: on
- **Confirm email**: on

Then **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

### 6. Run it

```bash
npm run dev
```

Open http://localhost:3000, enter your email, click the link in your inbox.

> Supabase's free tier sends a limited number of auth emails per hour. If you hit the
> limit, wait or plug in your own SMTP under Authentication → Emails.

---

## Deploy to Vercel

1. Push this folder to a **private** GitHub repo (make it public later once you're
   proud of it — it's a portfolio piece)

   ```bash
   git init
   git add .
   git commit -m "Prep OS: initial"
   git branch -M main
   git remote add origin https://github.com/<you>/prep-os.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Add the three environment variables from `.env.local`, but set
   `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://prep-os.vercel.app`)
4. Deploy
5. Go back to Supabase → **Authentication → URL Configuration** and add your Vercel
   URL as the Site URL, plus `https://prep-os.vercel.app/auth/callback` to the
   redirect list

Now it syncs across your laptop and phone, because the data lives in Postgres rather
than in a browser.

---

## Architecture, in one paragraph

Every page is a **Server Component** that calls `loadState()` once — a single parallel
fetch of progress, notes, sessions and applications. Interactive bits (`Check`, `Seg`,
`NoteDrawer`) are small **Client Components** that call **Server Actions** in
`app/actions.ts` and update optimistically with `useOptimistic`, so ticking a checkbox
feels instant even though it's a round trip to Postgres. Content that never changes —
the curriculum, the problem list — lives in `lib/` as typed data, not in the database,
so there's nothing to seed and no join to do. Access control is enforced by **Postgres
RLS**, not by application code, which means a bug in the app can't leak another user's
rows.

That paragraph is roughly what a good answer to "walk me through your project" sounds
like. Learn to say it out loud.

```
app/
  page.tsx              dashboard (server)
  LogSession.tsx        session logger (client)
  actions.ts            all server actions
  roadmap/ dsa/ system-design/ projects/ notes/ jobs/
  login/                magic link sign-in
  auth/callback/        OAuth code exchange
components/
  Nav.tsx  ui.tsx  Controls.tsx  NoteDrawer.tsx
lib/
  curriculum.ts         24-week plan, projects, tiers, patterns
  problems.ts           NeetCode 150 with LeetCode URLs
  state.ts              data loading + readiness scoring
  supabase/             browser + server clients
supabase/
  schema.sql            tables, RLS policies, triggers
middleware.ts           session refresh + route protection
```

---

## Scoring model

Readiness is a weighted sum of nine pillars (`lib/curriculum.ts` → `PILLARS`):

| Pillar | Weight | How it's measured |
|---|---|---|
| JS/TS Fundamentals | 18 | checklist completion |
| Angular Depth | 16 | checklist completion |
| System Design | 15 | 50% checklist, 50% per-problem mastery |
| DSA | 15 | 70% problems solved, 30% checklist |
| React / Next.js | 12 | checklist completion |
| Projects | 8 | milestone completion |
| AI Engineering | 6 | checklist completion |
| Interview Assets | 6 | checklist completion |
| Backend & Data | 4 | checklist completion |

The **Jobs page is locked below 60%** — on purpose. Applying early burns your best
companies for 6–12 months, and the gate is easier to respect when it's enforced by
software rather than willpower. Change the threshold in `lib/state.ts` → `gate()` if
you disagree, but think about why first.

---

## Things to build next (they're on the Projects page)

- Mistake log with spaced-repetition resurfacing
- Charts: readiness over time, hours per week
- Full-text search over notes — the `notes_search_idx` GIN index is already in the schema
- Markdown + syntax-highlighted code blocks in notes
- Command palette (⌘K)
- PWA + offline

---

## Troubleshooting

**"Not signed in" errors after login** — check the redirect URL in Supabase matches
your `NEXT_PUBLIC_SITE_URL` exactly, including protocol and no trailing slash.

**Checkbox ticks then reverts** — RLS is rejecting the write. Confirm you ran the whole
of `schema.sql` and that the policies exist under Database → Policies.

**No auth email arrives** — free tier rate limit. Check Authentication → Logs.

**Types complain about `next-env.d.ts`** — run `npm run dev` once; Next generates it.
