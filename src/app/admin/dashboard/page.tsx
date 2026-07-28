"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type Question = {
  id: string;
  question: string;
  reply: string | null;
  status: "pending" | "replied" | "archived";
  created_at: string;
  replied_at: string | null;
};

type Filter = "pending" | "replied" | "archived" | "all";

export default function DashboardPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadQuestions() {
    setLoading(true);
    const res = await fetch("/api/admin/questions");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setQuestions(data.questions ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadQuestions();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? questions : questions.filter((q) => q.status === filter)),
    [questions, filter]
  );

  const counts = useMemo(
    () => ({
      pending: questions.filter((q) => q.status === "pending").length,
      replied: questions.filter((q) => q.status === "replied").length,
      archived: questions.filter((q) => q.status === "archived").length,
      all: questions.length,
    }),
    [questions]
  );

  async function submitReply(id: string) {
    const reply = drafts[id]?.trim();
    if (!reply) return;
    setSavingId(id);
    const res = await fetch("/api/admin/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "reply", reply }),
    });
    if (res.ok) await loadQuestions();
    setSavingId(null);
  }

  async function archive(id: string) {
    setSavingId(id);
    const res = await fetch("/api/admin/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "archive" }),
    });
    if (res.ok) await loadQuestions();
    setSavingId(null);
  }

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <p className="font-display text-[13px] uppercase tracking-[0.28em] text-brass-deep">
              Board Dashboard
            </p>
            <h1 className="font-display text-2xl">Questions from the class</h1>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-ink-soft hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <div className="mb-8 flex gap-2">
          {(["pending", "replied", "archived", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                filter === f
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-soft hover:bg-white/50"
              }`}
            >
              {f} <span className="opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-ink-soft">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-6 py-10 text-center text-ink-soft">
            Nothing here yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {filtered.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-line bg-white/40 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`font-display text-[11px] uppercase tracking-[0.18em] ${
                      q.status === "pending"
                        ? "text-rust"
                        : q.status === "replied"
                        ? "text-ledger"
                        : "text-ink-soft/50"
                    }`}
                  >
                    {q.status}
                  </span>
                  <span className="text-xs text-ink-soft/50">
                    {new Date(q.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mb-4 leading-relaxed text-ink">{q.question}</p>

                {q.status === "replied" ? (
                  <div className="rounded-md bg-paper-dim px-4 py-3 text-sm text-ink-soft">
                    <span className="mb-1 block font-display text-[11px] uppercase tracking-[0.16em] text-ledger">
                      Replied
                    </span>
                    {q.reply}
                  </div>
                ) : q.status === "pending" ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={3}
                      value={drafts[q.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [q.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      className="w-full resize-none rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:ring-2 focus:ring-brass"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => submitReply(q.id)}
                        disabled={!drafts[q.id]?.trim() || savingId === q.id}
                        className="rounded-md bg-ink px-4 py-2 text-xs font-display uppercase tracking-[0.14em] text-paper hover:opacity-90 disabled:opacity-40"
                      >
                        {savingId === q.id ? "Sending..." : "Send reply"}
                      </button>
                      <button
                        onClick={() => archive(q.id)}
                        disabled={savingId === q.id}
                        className="rounded-md border border-line px-4 py-2 text-xs font-display uppercase tracking-[0.14em] text-ink-soft hover:bg-white/50 disabled:opacity-40"
                      >
                        Archive without reply
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
