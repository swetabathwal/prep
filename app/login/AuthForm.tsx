"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * One field set, one button.
 *
 * There is no "sign in vs create account" choice, because the user shouldn't
 * have to know which one applies. We try to sign in; if no such account exists,
 * we create it and sign in with the same credentials. Same outcome either way.
 *
 * Requires two Supabase settings (Authentication -> Sign In / Providers -> Email):
 *   - Allow new users to sign up: ON
 *   - Confirm email: OFF
 * Both are checked for explicitly below, with the fix in the error message.
 */
export default function AuthForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function go() {
    // Full navigation rather than router.push, so the proxy re-runs with the
    // freshly written session cookie.
    window.location.assign(next.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();

    // 1. Try to sign in.
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (!signIn.error) return go();

    const msg = signIn.error.message.toLowerCase();

    // Anything other than "no such account / wrong password" is a real error.
    if (!msg.includes("invalid login credentials")) {
      setBusy(false);
      if (msg.includes("email not confirmed")) {
        setError(
          "This account exists but isn't confirmed. In Supabase → Authentication → " +
            "Users, delete it; then turn OFF “Confirm email” under Sign In / " +
            "Providers → Email, and try again."
        );
      } else {
        setError(signIn.error.message);
      }
      return;
    }

    // 2. No account (or wrong password) — try creating it.
    const signUp = await supabase.auth.signUp({ email, password });

    if (signUp.error) {
      setBusy(false);
      const s = signUp.error.message.toLowerCase();

      if (s.includes("signups not allowed") || s.includes("signup is disabled")) {
        setError(
          "Sign-ups are turned off for this Supabase project. Turn ON " +
            "“Allow new users to sign up” in Supabase → Authentication → " +
            "Sign In / Providers → Email, then try again."
        );
      } else if (s.includes("already registered")) {
        setError("That email already has an account — the password is wrong.");
      } else if (s.includes("password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError(signUp.error.message);
      }
      return;
    }

    // 3. Account created. If there's no session, email confirmation is still on.
    if (!signUp.data.session) {
      setBusy(false);
      setError(
        "Account created, but Supabase is waiting on email confirmation. Turn OFF " +
          "“Confirm email” in Supabase → Authentication → Sign In / Providers → " +
          "Email, delete this user under Authentication → Users, then try again."
      );
      return;
    }

    go();
  }

  return (
    <div className="bg-white border border-[#e4e4e0] rounded-xl p-5">
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-[13px] font-medium">
          Email
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[14px] font-normal outline-none focus:border-[#c8613a]"
          />
        </label>

        <label className="block text-[13px] font-medium">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[14px] font-normal outline-none focus:border-[#c8613a]"
          />
        </label>

        <button
          disabled={busy}
          className="w-full bg-[#1a1a18] text-white rounded-lg py-2.5 text-[14px] font-medium hover:bg-black disabled:opacity-50"
        >
          {busy ? "Please wait…" : "Continue"}
        </button>

        {error && (
          <div className="bg-[#fbeee8] border-l-[3px] border-[#c8613a] rounded-r-lg px-3 py-2 text-[12.5px] leading-relaxed">
            {error}
          </div>
        )}
      </form>

      <p className="mt-3 text-[11.5px] text-[#6b6b66] leading-relaxed">
        First time? Your account is created automatically. Your data is private to it,
        enforced by row-level security in Postgres.
      </p>
    </div>
  );
}
