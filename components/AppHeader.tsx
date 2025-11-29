"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, LayoutGrid, Menu, X } from "lucide-react";

interface AppHeaderProps {
  showBackToHome?: boolean;
}

export default function AppHeader({ showBackToHome = false }: AppHeaderProps) {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8D5C4]/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-serif text-lg sm:text-xl uppercase tracking-[0.3em] text-[#B89B7A]"
        >
          Dreamr
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-base">
          {!loading && user ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <User className="h-5 w-5" />
                Your Photos
              </Link>
              <Link
                href="/board"
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <LayoutGrid className="h-5 w-5" />
                Vision Board
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
              >
                <LogOut className="h-5 w-5" />
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
                className="rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-5 py-2.5 text-base font-semibold text-white shadow-[0_10px_30px_rgba(212,165,116,0.35)] transition hover:shadow-[0_14px_40px_rgba(212,165,116,0.45)]"
              >
                Start Free
              </Link>
            </>
          ) : null}
        </nav>

        {/* Mobile Menu Button */}
        {!loading && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#7A6B5A] hover:text-[#3D3225] transition"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && !loading && (
        <nav className="md:hidden border-t border-[#E8D5C4]/70 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base text-[#7A6B5A] hover:text-[#3D3225] hover:bg-[#FDF8F3] rounded-xl transition"
                >
                  <User className="h-5 w-5" />
                  Your Photos
                </Link>
                <Link
                  href="/board"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base text-[#7A6B5A] hover:text-[#3D3225] hover:bg-[#FDF8F3] rounded-xl transition"
                >
                  <LayoutGrid className="h-5 w-5" />
                  Vision Board
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-[#7A6B5A] hover:text-[#3D3225] hover:bg-[#FDF8F3] rounded-xl transition"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-base text-[#7A6B5A] hover:text-[#3D3225] hover:bg-[#FDF8F3] rounded-xl transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center mx-4 mt-2 rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_30px_rgba(212,165,116,0.35)] transition hover:shadow-[0_14px_40px_rgba(212,165,116,0.45)]"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
