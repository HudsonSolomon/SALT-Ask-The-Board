"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <p className="mb-2 font-display text-[13px] uppercase tracking-[0.28em] text-brass">
          Board Access
        </p>
        <h1 className="mb-8 font-display text-3xl">Sign in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-paper/60">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-line-on-ink bg-white/5 px-4 py-2.5 text-paper placeholder:text-paper/30 focus:outline-none focus:ring-2 focus:ring-brass"
              placeholder="you@school.edu"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-paper/60">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line-on-ink bg-white/5 px-4 py-2.5 text-paper placeholder:text-paper/30 focus:outline-none focus:ring-2 focus:ring-brass"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-brass px-5 py-2.5 font-display text-sm uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-paper/50 hover:text-paper/80 transition-colors"
        >
          &larr; Back to the question form
        </Link>
      </div>
    </div>
  );
}
