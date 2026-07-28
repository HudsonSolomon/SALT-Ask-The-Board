import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const authed = await supabaseServer();
  const {
    data: { user },
  } = await authed.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const action = body?.action === "archive" ? "archive" : "reply";
  const reply = typeof body?.reply === "string" ? body.reply.trim() : "";

  if (!id) {
    return NextResponse.json({ error: "Missing question id." }, { status: 400 });
  }
  if (action === "reply" && !reply) {
    return NextResponse.json({ error: "Reply can't be empty." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const update =
    action === "archive"
      ? { status: "archived" as const }
      : { reply, status: "replied" as const, replied_at: new Date().toISOString() };

  const { error } = await supabase.from("questions").update(update).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
