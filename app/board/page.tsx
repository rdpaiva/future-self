"use client";

import { useState, useEffect } from "react";
import { Manifestation } from "@/lib/types";
import { dreams } from "@/lib/constants";
import { ArrowLeft, Trash2, Download, Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getManifestations,
  deleteManifestation as deleteManifestationFromDB,
} from "@/lib/supabase/manifestations";

export default function VisionBoard() {
  const [manifestations, setManifestations] = useState<Manifestation[]>([]);
  const [selectedManifestation, setSelectedManifestation] =
    useState<Manifestation | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadManifestations();
    }
  }, [user]);

  const loadManifestations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getManifestations(user.id);
      setManifestations(data);
    } catch (err) {
      console.error("Error loading manifestations:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteManifestation = async (id: string) => {
    try {
      setDeleting(true);
      await deleteManifestationFromDB(id);
      setManifestations((prev) => prev.filter((m) => m.id !== id));
      setSelectedManifestation(null);
      toast.success("Manifestation deleted");
    } catch (err) {
      console.error("Error deleting manifestation:", err);
      toast.error("Failed to delete manifestation", {
        description: "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (manifestation: Manifestation) => {
    const link = document.createElement("a");
    link.href = manifestation.generatedImage;
    link.download = `dreamr-${manifestation.id}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state while checking auth
  if (authLoading || (loading && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dreamr-gradient">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-dreamr-button mx-auto mb-4 animate-pulse" />
          <p className="text-dreamr-text font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-dreamr-gradient">
      {/* Decorative background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-dreamr-glow-1 rounded-full pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-dreamr-glow-2 rounded-full pointer-events-none" />

      <div className="relative z-10 px-5 py-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-dreamr-text-accent hover:text-dreamr-gold transition-colors font-sans text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 bg-dreamr-bg-card backdrop-blur-sm text-dreamr-text px-4 py-2 rounded-full font-sans text-sm shadow-dreamr-sm hover:shadow-dreamr-gold transition-all"
              >
                <User className="w-4 h-4" />
                Your Photos
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 bg-dreamr-bg-card backdrop-blur-sm text-dreamr-text px-4 py-2 rounded-full font-sans text-sm shadow-dreamr-sm hover:shadow-dreamr-gold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-light text-dreamr-text-dark mb-4">
            Your Vision Board
          </h1>
          <p className="text-lg text-dreamr-text font-light">
            Your collection of future selves
          </p>
        </div>

        {/* Grid of manifestations */}
        {manifestations.length === 0 ? (
          <div className="max-w-6xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-2xl text-dreamr-text-dark font-light mb-4">
              Your vision board is empty
            </h2>
            <p className="text-dreamr-text mb-8">
              Create your first manifestation to get started
            </p>
            <Link
              href="/"
              className="inline-block bg-dreamr-button text-white px-12 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px] transition-all"
            >
              Create Manifestation
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {manifestations.map((manifestation) => {
              const manifestationDreams = dreams.filter((d) =>
                manifestation.dreams.includes(d.id)
              );

              return (
                <div
                  key={manifestation.id}
                  onClick={() => setSelectedManifestation(manifestation)}
                  className="bg-dreamr-bg-card backdrop-blur-sm rounded-2xl overflow-hidden shadow-dreamr-sm hover:shadow-dreamr-gold transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
                >
                  <div
                    className="w-full h-64 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${manifestation.generatedImage})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {manifestationDreams.map((dream) => (
                        <span
                          key={dream.id}
                          className="text-xs px-3 py-1 bg-dreamr-gold/15 text-dreamr-text rounded-full font-sans"
                        >
                          {dream.icon} {dream.title}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-dreamr-text font-sans">
                      {new Date(manifestation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedManifestation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedManifestation(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-light text-dreamr-text-dark">
                Your Manifestation
              </h2>
              <button
                onClick={() => setSelectedManifestation(null)}
                className="text-dreamr-text hover:text-dreamr-text-dark text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <img
                src={selectedManifestation.generatedImage}
                alt="Manifestation"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {dreams
                .filter((d) => selectedManifestation.dreams.includes(d.id))
                .map((dream) => (
                  <span
                    key={dream.id}
                    className="px-4 py-2 bg-dreamr-gold/15 text-dreamr-text rounded-full font-sans text-sm"
                  >
                    {dream.icon} {dream.title}
                  </span>
                ))}
            </div>

            <div className="bg-dreamr-bg-cream rounded-2xl p-6 mb-6">
              <p className="text-lg text-dreamr-text-dark italic text-center leading-relaxed">
                "{selectedManifestation.affirmation}"
              </p>
            </div>

            <p className="text-sm text-dreamr-text font-sans mb-6 text-center">
              Created on{" "}
              {new Date(selectedManifestation.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(selectedManifestation)}
                className="flex-1 bg-dreamr-button text-white px-6 py-3 rounded-full font-sans text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-dreamr-gold-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this manifestation?")
                  ) {
                    deleteManifestation(selectedManifestation.id);
                  }
                }}
                disabled={deleting}
                className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-sans text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
