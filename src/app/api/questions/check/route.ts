import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeCustomCode } from "@/lib/claimCode";

// Escapes ilike's special wildcard characters (% and _) so a code
// containing them is matched literally, not as a pattern.
function escapeForIlike(value: string): string {
  return value.replace(/[%_\\]/g, (match) => `\\${match}`);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const raw = typeof body?.code === "string" ? body.code : "";
  const code = normalizeCustomCode(raw);

  if (!code) {
    return NextResponse.json({ error: "Enter your claim code." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select("question, reply, status, created_at")
    .ilike("code", escapeForIlike(code))
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "No question found for that code." }, { status: 404 });
  }

  return NextResponse.json({ result: data });
}