import { createBrowserClient } from "@supabase/ssr";

// Public, anon-key client. Used only for signing board members in and out.
// It has no access to the questions table (see supabase/schema.sql) — it can
// only talk to Supabase Auth.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
