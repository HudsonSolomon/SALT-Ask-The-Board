"use client";

import { useState } from "react";
import Link from "next/link";
import { TicketStub } from "@/components/TicketStub";

const MAX_LENGTH = 1000;

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [code, setCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setCode(data.code);
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
          <span className="font-display text-lg tracking-tight">
            Ask the Board
          </span>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/check" className="text-ink-soft hover:text-ink transition-colors">
              Check a reply
            </Link>
            <Link
              href="/admin/login"
              className="text-ink-soft/60 hover:text-ink-soft transition-colors"
            >
              Board sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-3xl">
          {!code ? (
            <>
              <div className="mb-10 max-w-xl">
                <p className="mb-3 font-display text-[13px] uppercase tracking-[0.28em] text-brass-deep">
                  Freshman Class &middot; Leadership Board
                </p>
                <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl">
                  Ask the board anything.
                </h1>
                <p className="mt-4 text-ink-soft leading-relaxed">
                  Nothing about who you are is ever collected — no name, no
                  email, no login. Submit your question, and you&rsquo;ll get
                  a private code to check for a reply later. Only board
                  members can read what you write.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-line bg-white/40 p-6 shadow-sm sm:p-8"
              >
                <label
                  htmlFor="question"
                  className="mb-2 block font-display text-sm uppercase tracking-[0.18em] text-ink-soft"
                >
                  Your question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, MAX_LENGTH))}
                  rows={5}
                  placeholder="Ask about orientation, clubs, academics, anything on your mind about the school year..."
                  className="w-full resize-none rounded-md border border-line bg-paper px-4 py-3 font-body text-base leading-relaxed text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-brass"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-ink-soft/60">
                    {question.length}/{MAX_LENGTH}
                  </span>
                  {error && <span className="text-xs text-rust">{error}</span>}
                </div>

                <button
                  type="submit"
                  disabled={!question.trim() || status === "sending"}
                  className="mt-5 w-full rounded-md bg-ink px-5 py-3 font-display text-sm uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-90 disabled:opacity-40 sm:w-auto"
                >
                  {status === "sending" ? "Submitting..." : "Submit privately"}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="mb-2 font-display text-[13px] uppercase tracking-[0.28em] text-ledger">
                Question received
              </p>
              <h1 className="mb-8 font-display text-3xl sm:text-4xl">
                Save your claim code.
              </h1>
              <TicketStub code={code} />
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/check"
                  className="rounded-md border border-line px-5 py-2.5 font-display text-sm uppercase tracking-[0.14em] text-ink hover:bg-white/50 transition-colors"
                >
                  Go to check a reply
                </Link>
                <button
                  onClick={() => {
                    setCode(null);
                    setQuestion("");
                  }}
                  className="text-sm text-ink-soft hover:text-ink transition-colors"
                >
                  Ask another question
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-line px-6 py-5 text-center text-xs text-ink-soft/60 sm:px-10">
        Questions are never linked to names, accounts, or devices.
      </footer>
    </div>
  );
}
