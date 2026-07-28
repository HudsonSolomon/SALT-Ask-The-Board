import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateClaimCode } from "@/lib/claimCode";

const MAX_LENGTH = 1000;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }
  if (question.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  // Extremely low collision odds, but retry once with a fresh code just in case.
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateClaimCode();
    const { error } = await supabase.from("questions").insert({
      code,
      question,
    });

    if (!error) {
      return NextResponse.json({ code });
    }
    if (error.code !== "23505") {
      // Not a unique-constraint violation — a real problem, stop retrying.
      return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
}
