"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import WelcomeStep from "@/components/WelcomeStep";
import UploadStep from "@/components/UploadStep";
import DreamSelectionStep from "@/components/DreamSelectionStep";
import RevealStep from "@/components/RevealStep";
import { dreams, affirmations } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { createManifestation } from "@/lib/supabase/manifestations";

export default function Home() {
  const [step, setStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Check for preselected image from profile page
  useEffect(() => {
    const fromProfile = searchParams.get("fromProfile");
    if (fromProfile === "true") {
      const preselectedImage = sessionStorage.getItem("preselectedImage");
      if (preselectedImage) {
        setUploadedImage(preselectedImage);
        setStep(2); // Skip to dream selection
        sessionStorage.removeItem("preselectedImage");
        // Clean URL
        router.replace("/");
      }
    }
  }, [searchParams, router]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FEF3E8] to-[#FDF0E6]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4956A] mx-auto mb-4 animate-pulse" />
          <p className="text-[#7A6B5A] font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  const toggleDream = (id: string) => {
    setSelectedDreams((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const generateImage = async () => {
    if (!uploadedImage || selectedDreams.length === 0) return;

    setIsGenerating(true);

    try {
      // Get the dream prompts
      const dreamPrompts = selectedDreams
        .map((id) => dreams.find((d) => d.id === id)?.prompt)
        .filter(Boolean);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
          dreams: dreamPrompts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setGeneratedImage(data.generatedImage);
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error("Failed to generate image", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevealStep = () => {
    setStep(3);
    generateImage();
  };

  const saveToVisionBoard = async () => {
    if (!generatedImage || !uploadedImage || !user) return;

    setIsSaving(true);

    try {
      const affirmation =
        affirmations[Math.floor(Math.random() * affirmations.length)];

      await createManifestation(
        user.id,
        uploadedImage,
        generatedImage,
        selectedDreams,
        affirmation
      );

      toast.success("Saved to your vision board!", {
        description: "Your manifestation has been added to your collection.",
      });
      router.push("/board");
    } catch (err) {
      console.error("Error saving to vision board:", err);
      toast.error("Failed to save to vision board", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startOver = () => {
    setStep(0);
    setUploadedImage(null);
    setSelectedDreams([]);
    setGeneratedImage(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FEF3E8] to-[#FDF0E6]">
      {/* Decorative background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,200,150,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,180,120,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" />

      {/* Header Actions */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <Link
          href="/profile"
          className="bg-white/70 backdrop-blur-sm text-[#7A6B5A] p-3 rounded-full font-sans text-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(212,165,116,0.3)] hover:scale-105 transition-all"
          title="Your Photos"
        >
          <User className="w-4 h-4" />
        </Link>
        <Link
          href="/board"
          className="bg-white/70 backdrop-blur-sm text-[#7A6B5A] px-5 py-3 rounded-full font-sans text-sm tracking-wide flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(212,165,116,0.3)] hover:scale-105 transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
          Vision Board
        </Link>
        <button
          onClick={signOut}
          className="bg-white/70 backdrop-blur-sm text-[#7A6B5A] p-3 rounded-full font-sans text-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(212,165,116,0.3)] hover:scale-105 transition-all"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}

      {step === 1 && (
        <UploadStep
          uploadedImage={uploadedImage}
          onImageUpload={setUploadedImage}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DreamSelectionStep
          selectedDreams={selectedDreams}
          onToggleDream={toggleDream}
          onNext={handleRevealStep}
        />
      )}

      {step === 3 && uploadedImage && (
        <RevealStep
          originalImage={uploadedImage}
          generatedImage={generatedImage}
          selectedDreams={selectedDreams}
          onSave={saveToVisionBoard}
          onStartOver={startOver}
          isGenerating={isGenerating}
          isSaving={isSaving}
        />
      )}
    </main>
  );
}
