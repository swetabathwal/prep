import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * The explicit checks below exist because a missing env var otherwise surfaces
 * as a vague "Failed to fetch" — the client happily builds a request to
 * `undefined/auth/v1/token` and the browser can't resolve it. Failing fast with
 * a real message is worth the six lines.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars are missing from the browser bundle. Check that " +
        ".env.local exists at the project root with NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY, then RESTART the dev server — Next only " +
        "reads env files at startup."
    );
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL looks wrong: "${url}". It should be your API ` +
        "endpoint, e.g. https://abcdefghijk.supabase.co — not the " +
        "supabase.com/dashboard/... address you browse to."
    );
  }

  return createBrowserClient(url, key);
}
