"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, LayoutGrid } from "lucide-react";

interface AppHeaderProps {
  showBackToHome?: boolean;
}

export default function AppHeader({ showBackToHome = false }: AppHeaderProps) {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8D5C4]/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-lg uppercase tracking-[0.3em] text-[#B89B7A]"
        >
          Dreamr
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {!loading && user ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <User className="h-4 w-4" />
                Your Photos
              </Link>
              <Link
                href="/board"
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <LayoutGrid className="h-4 w-4" />
                Vision Board
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/auth/login"
                className="text-[#B89B7A] transition hover:text-[#3D3225]"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(212,165,116,0.35)] transition hover:shadow-[0_14px_40px_rgba(212,165,116,0.45)]"
              >
                Start Free
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
