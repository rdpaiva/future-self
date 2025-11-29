"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-dreamr-gradient flex items-center justify-center p-5">
      {/* Decorative background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-dreamr-glow-1 rounded-full pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-dreamr-glow-2 rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-light text-dreamr-text-dark mb-3 tracking-tight">
            Dreamr
          </h1>
          <p className="text-dreamr-text font-light">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="bg-dreamr-bg-card backdrop-blur-sm rounded-3xl p-8 shadow-dreamr">
          <h2 className="text-2xl font-light text-dreamr-text-dark mb-6">Log In</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-800 text-sm font-sans">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans text-dreamr-text mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-dreamr-gold/30 bg-white/50 text-dreamr-text-dark font-sans focus:outline-none focus:ring-2 focus:ring-dreamr-gold focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-sans text-dreamr-text mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-dreamr-gold/30 bg-white/50 text-dreamr-text-dark font-sans focus:outline-none focus:ring-2 focus:ring-dreamr-gold focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dreamr-button text-white px-6 py-4 rounded-full font-sans text-sm tracking-[2px] uppercase shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-sans text-dreamr-text">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-dreamr-gold hover:text-dreamr-gold-dark underline underline-offset-4 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm font-sans text-dreamr-text-light italic">
          "Your future self is already within you."
        </p>
      </div>
    </main>
  );
}
