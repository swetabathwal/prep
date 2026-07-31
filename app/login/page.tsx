"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
        }/auth/callback`,
      },
    });

    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-br from-[#1f1f1d] to-[#33322e] text-[#f4f2ee] rounded-2xl p-6 mb-4">
          <h1 className="text-xl font-semibold tracking-tight">Prep OS</h1>
          <p className="text-[13px] text-[#b5b2ab] mt-1">
            Senior frontend switch — 24 weeks, tracked end to end.
          </p>
        </div>

        <div className="bg-white border border-[#e4e4e0] rounded-xl p-5">
          {sent ? (
            <div className="text-[13.5px] leading-relaxed">
              <p className="font-semibold mb-1">Check your inbox.</p>
              <p className="text-[#6b6b66]">
                A sign-in link is on its way to <b>{email}</b>. It expires in an hour.
                You can close this tab.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <label className="block text-[13px] font-medium">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[14px] font-normal outline-none focus:border-[#c8613a]"
                />
              </label>
              <button
                disabled={busy}
                className="w-full bg-[#1a1a18] text-white rounded-lg py-2.5 text-[14px] font-medium hover:bg-black disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send me a sign-in link"}
              </button>
              {error && <p className="text-[12.5px] text-[#b0473f]">{error}</p>}
              <p className="text-[11.5px] text-[#6b6b66] leading-relaxed">
                No password. We email you a one-time link. Your data is private to your
                account — enforced at the database level with row-level security.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
