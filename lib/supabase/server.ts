import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Explicitly typed because TypeScript can't contextually infer the parameter
 * of `setAll` here — Next's cookie store return type doesn't line up exactly
 * with what @supabase/ssr expects, which breaks inference on the object literal.
 */
type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/**
 * Supabase client for server components and server actions.
 *
 * Note: this app runs in single-user mode — there are no Supabase accounts.
 * Access is controlled by the passcode gate in middleware.ts, and every row
 * belongs to SINGLE_USER_ID. See lib/single-user.ts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    }
  );
}
