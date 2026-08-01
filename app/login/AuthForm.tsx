"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Email + password. No magic links, no confirmation emails, no redirect URLs —
 * which means there is nothing in the email pipeline that can break.
 *
 * Requires "Confirm email" to be OFF in Supabase -> Authentication -> Providers
 * -> Email. With it on, signUp() creates an unconfirmed user who can't sign in
 * until they click a link, which is exactly the complexity we're avoiding.
 */
export default function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }

    // Full navigation rather than router.push, so middleware re-runs with the
    // freshly written session cookie.
    window.location.assign(next.startsWith("/") ? next : "/");
  }

  return (
    <div className="bg-white border border-[#e4e4e0] rounded-xl p-5">
      <div className="flex gap-1 mb-4 p-0.5 bg-[#f1f0ed] rounded-lg">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
              mode === m ? "bg-white shadow-sm" : "text-[#6b6b66] hover:text-[#1a1a18]"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label className="block text-[13px] font-medium">
          Email
          <input
            type="email"
            required
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
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="mt-1 w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[14px] font-normal outline-none focus:border-[#c8613a]"
          />
        </label>

        <button
          disabled={busy}
          className="w-full bg-[#1a1a18] text-white rounded-lg py-2.5 text-[14px] font-medium hover:bg-black disabled:opacity-50"
        >
          {busy
            ? "Please wait…"
            : mode === "signin"
            ? "Sign in"
            : "Create account"}
        </button>

        {error && (
          <div className="bg-[#fbeee8] border-l-[3px] border-[#c8613a] rounded-r-lg px-3 py-2 text-[12.5px] leading-relaxed">
            {error}
            {error.toLowerCase().includes("invalid login") && (
              <span className="block mt-1 text-[#6b6b66]">
                First time here? Use “Create account”.
              </span>
            )}
          </div>
        )}
      </form>

      <p className="mt-3 text-[11.5px] text-[#6b6b66] leading-relaxed">
        Your data is private to your account, enforced by row-level security in
        Postgres — not by application code.
      </p>
    </div>
  );
}
