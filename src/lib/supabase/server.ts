import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Reads the logged-in board member's session from cookies. Used in API
// routes and Server Components to check "is someone actually logged in"
// before we let them near the questions table (via supabaseAdmin()).
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore since
            // middleware refreshes the session on every request.
          }
        },
      },
    }
  );
}
