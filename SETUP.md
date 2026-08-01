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

Supabase split these across two pages in the 2026 dashboard redesign.

**The Project URL** — Settings → **Data API** (under the Integrations heading).
It's at the top, labelled "Project URL", and looks like:

```
https://abcdefghijk.supabase.co
```

> Shortcut: it's also visible in your browser address bar. If you're on
> `.../dashboard/project/abcdefghijk/...` then your URL is
> `https://abcdefghijk.supabase.co`.

**The anon key** — Settings → **API Keys** → click the
**"Legacy anon, service_role API keys"** tab → copy the `anon` `public` value
(a long string starting `eyJ...`).

> **Use the legacy anon key, not the new `sb_publishable_...` one.** The new format
> only works on recent `@supabase/supabase-js` versions and isn't worth debugging on
> day one. Migrating to publishable keys later is a good small task — key rotation
> strategy is a fair senior-level interview question.

> Neither value is a secret. The URL is public, and the anon key is *designed* to ship
> in your browser bundle — it's safe only because of the RLS policies from Step 3.
> The keys under **Secret keys** / `service_role` bypass RLS entirely. Never put those
> in this app.

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

## Step 5b · Only if you ran `single-user.sql`

If you already ran `supabase/single-user.sql` at some point, run
`supabase/restore-auth.sql` now to put per-user accounts back.

⚠️ It **deletes** rows owned by the single-user placeholder id, because they point at
a user that doesn't exist. If you'd already logged real progress, export it first:
Table Editor → table → Export → CSV.

If you only ever ran `schema.sql`, skip this step.

---

## Step 6 · Turn on email + password sign-in

In Supabase:

1. **Authentication** → **Sign In / Providers** → **Email**
   - Enable email provider: **ON**
   - **Confirm email: OFF** ⚠️
   - Save

   > **"Confirm email: OFF" is the whole simplification.** With it on, creating an
   > account sends a confirmation email, and you can't sign in until you click the
   > link — which drags back in email templates, redirect URLs and the token flow
   > that broke last time. With it off, "Create account" signs you straight in and
   > **no email is ever sent**. Nothing in the email pipeline can fail because there
   > is no email pipeline.
   >
   > The trade-off: nobody verifies the address is real. For a personal tool that
   > doesn't matter. For a product it would — you'd want confirmation back on.

2. **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:3000`
   - Save

   (No redirect URLs needed — password sign-in never leaves your site.)

---

## ~~Step 6b · Email templates~~ — not needed with password auth

<details>
<summary>Only relevant if you switch back to magic links later</summary>

**Skip this and you get an infinite login loop** — click the link, land back on the
login page, forever.

Supabase's default email template uses the **implicit flow**: it returns your session
in the URL *hash* (`#access_token=...`). Browsers never send the fragment to the
server, so a server-rendered app physically cannot read it. You need the **token_hash
flow** instead.

Go to **Authentication** → **Emails** (or **Email Templates**).

**Template: "Confirm signup"** — replace the body with:

```html
<h2>Confirm your signup</h2>
<p>Click below to sign in to Prep OS:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    Sign in
  </a>
</p>
```

**Template: "Magic Link"** — replace the body with:

```html
<h2>Sign in to Prep OS</h2>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    Sign in
  </a>
</p>
```

Save both.

> You need **both**: your very first sign-in sends "Confirm signup" (because email
> confirmation is on), every one after that sends "Magic Link".

> `{{ .SiteURL }}` resolves to whatever you set in URL Configuration. That's why
> Step 10 matters — after deploying, the Site URL must point at your Vercel domain
> or your production emails will link back to localhost.

</details>

---

## Step 7 · Run it

```powershell
npm run dev
```

Open **http://localhost:3000**

You'll be redirected to `/login`. Click **Create account**, enter an email and a
password (6+ characters), submit. You're straight in — no email, no waiting.

Next time, use **Sign in** with the same details.

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

**"Email not confirmed" when signing in**
Confirm email is still ON. Turn it off (Step 6), then delete the half-created user:
Supabase → **Authentication → Users** → find your email → delete → sign up again.

**"Invalid login credentials"**
Either the password is wrong, or the account doesn't exist yet — use **Create
account** the first time. Check Supabase → **Authentication → Users** to see whether
your email is actually there.

**Redirected to /login in a loop**
1. Confirm a user row exists under **Authentication → Users**.
2. On Vercel: did you **redeploy** after adding env vars? They only apply to a new build.
3. Check the two `NEXT_PUBLIC_SUPABASE_*` values match the project you're looking at.
4. Supabase → **Authentication → Logs** shows every auth attempt and why it failed.

**"Not signed in" thrown from a server action**
The session cookie expired and the proxy didn't refresh it. Sign out and back in. If
it recurs, make sure you didn't delete the `supabase.auth.getUser()` call in
`proxy.ts` — that call is what refreshes the cookie.

**⚠ The "middleware" file convention is deprecated**
Next 16 renamed `middleware.ts` to `proxy.ts` and the exported function from
`middleware` to `proxy`. This project already uses `proxy.ts`. If you still have a
`middleware.ts` lying around, delete it — otherwise both run.

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
