"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  question: string;
  reply: string | null;
  status: "pending" | "replied" | "archived";
  created_at: string;
};

export default function CheckPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/questions/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setResult(data.result);
      setStatus("idle");
    } catch {
      setError("Couldn't reach the server. Try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight">
            Ask the Board
          </Link>
          <nav className="text-sm">
            <Link href="/" className="text-ink-soft hover:text-ink transition-colors">
              Ask a question
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-lg">
          <p className="mb-3 font-display text-[13px] uppercase tracking-[0.28em] text-brass-deep">
            Redeem your ticket
          </p>
          <h1 className="mb-3 font-display text-3xl sm:text-4xl">
            Check for a reply
          </h1>
          <p className="mb-8 text-ink-soft leading-relaxed">
            Enter the claim code you were given when you submitted your
            question.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX"
              className="flex-1 rounded-md border border-line bg-white/40 px-4 py-3 font-mono text-lg tracking-[0.12em] text-ink placeholder:text-ink-soft/40 focus:outline-none focus:ring-2 focus:ring-brass"
            />
            <button
              type="submit"
              disabled={!code.trim() || status === "loading"}
              className="rounded-md bg-ink px-6 py-3 font-display text-sm uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {status === "loading" ? "Checking..." : "Check"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-rust">{error}</p>}

          {result && (
            <div className="mt-8 rounded-lg border border-line bg-white/40 p-6">
              <p className="mb-1 font-display text-[12px] uppercase tracking-[0.2em] text-ink-soft/70">
                Your question
              </p>
              <p className="mb-5 leading-relaxed text-ink">{result.question}</p>

              {result.status === "replied" ? (
                <>
                  <p className="mb-1 font-display text-[12px] uppercase tracking-[0.2em] text-ledger">
                    Board reply
                  </p>
                  <p className="leading-relaxed text-ink">{result.reply}</p>
                </>
              ) : (
                <p className="rounded-md bg-paper-dim px-4 py-3 text-sm text-ink-soft">
                  Still waiting on a reply from the board. Check back later.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
