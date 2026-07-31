# Setup & Deploy — step by step

Follow this top to bottom. Roughly an hour, entirely on free tiers.
Commands are written for **Windows PowerShell** (your machine).

---

## Before you start

| You need | Check it | If missing |
|---|---|---|
| Node.js 20+ | `node -v` | [nodejs.org](https://nodejs.org) → LTS installer |
| npm | `npm -v` | comes with Node |
| Git | `git --version` | [git-scm.com](https://git-scm.com/download/win) |
| GitHub account | — | [github.com/signup](https://github.com/signup) |
| Supabase account | — | [supabase.com](https://supabase.com) — sign in with GitHub |
| Vercel account | — | [vercel.com](https://vercel.com) — sign in with GitHub |

Signing into Supabase and Vercel with GitHub saves you two password setups later.

---

# PART 1 — Get it running locally

## Step 1 · Install dependencies

```powershell
cd C:\prep
npm install
```

Takes 1–2 minutes. Warnings are fine; errors are not.

> If it fails with a Node version error, you're on an old Node. Install Node 20 LTS and
> reopen PowerShell.

---

## Step 2 · Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. **Name**: `prep-os`
3. **Database Password**: click Generate, then **save it in your password manager**
   (you won't need it for this app, but you'll want it if you ever connect directly)
4. **Region**: `South Asia (Mumbai)` — closest to you, lowest latency
5. **Plan**: Free
6. Click **Create new project** and wait ~2 minutes while it provisions

---

## Step 3 · Create the tables

1. In your project, left sidebar → **SQL Editor**
2. Click **New query**
3. Open `C:\prep\supabase\schema.sql`, select all, copy
4. Paste into the editor
5. Click **Run** (or Ctrl+Enter)

You should see **Success. No rows returned.**

**Verify it worked:** left sidebar → **Table Editor**. You should see five tables:
`progress`, `notes`, `sessions`, `applications`, `settings`.

> Read this SQL file properly at some point. RLS policies, triggers and a generic
> key/value table are all fair game in a backend-adjacent interview question, and you
> can honestly say you wrote the schema.

---

## Step 4 · Get your API keys

1. Left sidebar → **Project Settings** (gear icon) → **API**
2. You need two values:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **anon public** key — a long string starting `eyJ...`

Leave this tab open.

> The `anon` key is *designed* to be public — it's in your browser bundle. It's only
> safe because of the RLS policies you just created. Never copy the `service_role`
> key into this app; that one bypasses RLS entirely.

---

## Step 5 · Create your env file

```powershell
cd C:\prep
copy .env.example .env.local
notepad .env.local
```

Fill it in:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-long-key...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Save and close.

> **No trailing slash** on the URL. This causes about half of all setup failures.

---

## Step 6 · Turn on email sign-in

In Supabase:

1. **Authentication** → **Sign In / Providers** → **Email**
   - Enable email provider: **ON**
   - Confirm email: **ON**
   - Save

2. **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs** → Add URL: `http://localhost:3000/auth/callback`
   - Save

---

## Step 7 · Run it

```powershell
npm run dev
```

Open **http://localhost:3000**

You'll be redirected to `/login`. Enter your email → check your inbox → click the link.

You should land on the dashboard with 0% readiness. **Tick one checkbox on the Roadmap
page and reload** — if it's still ticked, your database is wired up correctly.

✅ **Part 1 done.** Stop here if you want; it works locally. Part 2 makes it available
on your phone.

---

# PART 2 — Deploy to Vercel

## Step 8 · Push to GitHub

Make it **private** for now. Turn it public in week 18 when it's a portfolio piece.

```powershell
cd C:\prep
git init
git add .
git commit -m "Prep OS: initial commit"
git branch -M main
```

Now create the repo on GitHub:

1. [github.com/new](https://github.com/new)
2. **Repository name**: `prep-os`
3. **Private**
4. Do **not** tick "Add a README" — you already have one
5. **Create repository**

Then, using the URL GitHub shows you:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/prep-os.git
git push -u origin main
```

> Confirm on GitHub that `.env.local` is **not** in the repo. `.gitignore` excludes it,
> but check — leaked keys are the single most common junior mistake, and interviewers
> do look.

---

## Step 9 · Import into Vercel

1. [vercel.com/new](https://vercel.com/new)
2. Find `prep-os` → **Import**
3. Framework Preset should auto-detect **Next.js** — leave everything default
4. Expand **Environment Variables** and add all three:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | same as local |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same as local |
   | `NEXT_PUBLIC_SITE_URL` | **leave blank for now** — see Step 10 |

   Actually: put a placeholder like `https://prep-os.vercel.app` in the third one.
   You'll correct it in Step 10 once you know your real URL.

5. **Deploy** — takes 1–2 minutes

---

## Step 10 · Fix the URLs (the step everyone skips)

Vercel gives you a URL like `https://prep-os-xxxx.vercel.app`. Copy it.

**In Vercel** → your project → **Settings** → **Environment Variables**:
- Edit `NEXT_PUBLIC_SITE_URL` → set it to your exact Vercel URL, no trailing slash
- Then **Deployments** → click the latest → **⋯** → **Redeploy**
  (env changes need a rebuild to take effect)

**In Supabase** → **Authentication** → **URL Configuration**:
- **Site URL**: `https://prep-os-xxxx.vercel.app`
- **Redirect URLs**: add `https://prep-os-xxxx.vercel.app/auth/callback`
  (keep the localhost one too, so local dev still works)
- Save

---

## Step 11 · Verify

1. Open your Vercel URL on your **phone**
2. Sign in with the same email
3. Your ticks and notes from localhost should already be there — same Postgres database

✅ **Deployed.** Add it to your phone home screen (Share → Add to Home Screen).

---

# Daily use from here

```powershell
cd C:\prep
npm run dev          # only when you want to change the code
```

For normal daily tracking just use the Vercel URL. Local dev is for when you're
building the features listed on the Projects page.

To ship a change:

```powershell
git add .
git commit -m "what you changed"
git push
```

Vercel redeploys automatically in about a minute.

---

# Troubleshooting

**Redirected to /login in a loop**
Site URL and redirect URL in Supabase don't exactly match `NEXT_PUBLIC_SITE_URL`.
Check protocol (`https` not `http`) and no trailing slash on either.

**Checkbox ticks, then reverts on reload**
The write is being rejected by RLS. Go to Supabase → **Database** → **Policies** and
confirm each of the five tables has four policies. If not, re-run `schema.sql`.

**No sign-in email arrives**
Free tier limits auth emails per hour. Check **Authentication** → **Logs**. Wait a few
minutes, or add your own SMTP under Authentication → Emails.

**Build fails on Vercel with a type error**
Run `npm run typecheck` locally to see the same error with full context. Paste it to me
and I'll fix it.

**`next-env.d.ts` missing / TS errors on first open**
Run `npm run dev` once — Next generates that file on first boot.

**Port 3000 already in use**
`npm run dev -- -p 3001`, and update the localhost URLs in Supabase to match.
