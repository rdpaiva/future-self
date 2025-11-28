"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess(true);
      } else {
        // Auto-login successful
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FEF3E8] to-[#FDF0E6] flex items-center justify-center p-5">
        {/* Decorative background elements */}
        <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,200,150,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,180,120,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4956A] mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <h2 className="text-3xl font-light text-[#3D3225] mb-4">
              Check Your Email
            </h2>
            <p className="text-[#7A6B5A] mb-6 leading-relaxed">
              We've sent you a confirmation link to <strong>{email}</strong>.
              Please check your inbox and click the link to activate your
              account.
            </p>
            <Link
              href="/auth/login"
              className="inline-block text-[#D4A574] hover:text-[#C4956A] underline underline-offset-4 font-sans text-sm"
            >
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FEF3E8] to-[#FDF0E6] flex items-center justify-center p-5">
      {/* Decorative background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,200,150,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,180,120,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-light text-[#3D3225] mb-3 tracking-tight">
            Manifestr
          </h1>
          <p className="text-[#7A6B5A] font-light">
            Begin your transformation
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-light text-[#3D3225] mb-6">Sign Up</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-800 text-sm font-sans">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-sans text-[#7A6B5A] mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#D4A574]/30 bg-white/50 text-[#3D3225] font-sans focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans text-[#7A6B5A] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#D4A574]/30 bg-white/50 text-[#3D3225] font-sans focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-sans text-[#7A6B5A] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border border-[#D4A574]/30 bg-white/50 text-[#3D3225] font-sans focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs font-sans text-[#9A8B7A] mt-1">
                At least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white px-6 py-4 rounded-full font-sans text-sm tracking-[2px] uppercase shadow-[0_8px_30px_rgba(212,165,116,0.4)] hover:shadow-[0_12px_40px_rgba(212,165,116,0.5)] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-sans text-[#7A6B5A]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#D4A574] hover:text-[#C4956A] underline underline-offset-4 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm font-sans text-[#9A8B7A] italic">
          "Every day, I move closer to my dreams."
        </p>
      </div>
    </main>
  );
}
