import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const authed = await supabaseServer();
  const {
    data: { user },
  } = await authed.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select("id, question, reply, status, created_at, replied_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load questions." }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}
