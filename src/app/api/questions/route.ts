import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  generateClaimCode,
  normalizeCustomCode,
  validateCustomCode,
} from "@/lib/claimCode";

const MAX_LENGTH = 1000;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const customCodeInput =
    typeof body?.customCode === "string" ? body.customCode : "";

  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }
  if (question.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_LENGTH} characters.` },
      { status: 400 }
    );
  }

  let customCode: string | null = null;
  if (customCodeInput.trim()) {
    const validationError = validateCustomCode(customCodeInput);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    customCode = normalizeCustomCode(customCodeInput);
  }

  const supabase = supabaseAdmin();

  if (customCode) {
    const { error } = await supabase.from("questions").insert({
      code: customCode,
      question,
    });

    if (!error) {
      return NextResponse.json({ code: customCode });
    }
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That code is already taken. Try a different one." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateClaimCode();
    const { error } = await supabase.from("questions").insert({ code, question });

    if (!error) {
      return NextResponse.json({ code });
    }
    if (error.code !== "23505") {
      return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
}