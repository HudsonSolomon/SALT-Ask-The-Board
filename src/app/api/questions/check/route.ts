import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";

  if (!code) {
    return NextResponse.json({ error: "Enter your claim code." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select("question, reply, status, created_at")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "No question found for that code." }, { status: 404 });
  }

  return NextResponse.json({ result: data });
}
