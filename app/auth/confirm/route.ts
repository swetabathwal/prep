import { NextResponse, type NextRequest } from "next/server";

/**
 * Dead route, kept only so old magic-link emails don't 404.
 * This app no longer uses Supabase accounts — see lib/passcode.ts.
 */
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`);
}
