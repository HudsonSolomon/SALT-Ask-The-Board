import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, which bypasses Row Level Security.
// It must only ever be imported from server-side code (API routes, Server
// Components, Server Actions) — never from a Client Component or anything
// that ships to the browser. The service role key is not prefixed with
// NEXT_PUBLIC_, so Next.js will refuse to expose it to client bundles as
// long as this rule is respected.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
