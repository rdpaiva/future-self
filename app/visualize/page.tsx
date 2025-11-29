"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, LayoutGrid, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createManifestation } from "@/lib/supabase/manifestations";
import { affirmations } from "@/lib/constants";
import UploadStep from "@/components/UploadStep";
import DreamSelectionStep from "@/components/DreamSelectionStep";
import RevealStep from "@/components/RevealStep";

const getRandomAffirmation = () =>
    affirmations[Math.floor(Math.random() * affirmations.length)] ?? affirmations[0];

function VisualContent() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [visionDescription, setVisionDescription] = useState("");

    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for pre-selected photo from profile or session storage
    useEffect(() => {
        const photoFromUrl = searchParams.get("photo");
        const photoFromSession = sessionStorage.getItem("preselectedImage");

        if (photoFromUrl) {
            setUploadedImage(decodeURIComponent(photoFromUrl));
            // Clear the URL param after using it
            router.replace("/visualize", { scroll: false });
        } else if (photoFromSession) {
            setUploadedImage(photoFromSession);
            // Clear session storage after using it
            sessionStorage.removeItem("preselectedImage");
        }
    }, [searchParams, router]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login?redirect=/visualize");
        }
    }, [user, authLoading, router]);

    const handleImageUpload = (image: string) => {
        setUploadedImage(image);
    };

    const handleNextFromUpload = () => {
        setStep(2);
    };

    const handleToggleDream = (id: string) => {
        setSelectedDreams(prev =>
            prev.includes(id)
                ? prev.filter(dreamId => dreamId !== id)
                : [...prev, id]
        );
    };

    const handleNextFromDreamSelection = async () => {
        if (!uploadedImage) return;

        setStep(3);
        setIsGenerating(true);

        try {
            // Include custom description in the dreams array if provided
            const dreamsWithDescription = visionDescription.trim()
                ? [...selectedDreams, visionDescription.trim()]
                : selectedDreams;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: uploadedImage,
                    dreams: dreamsWithDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            setGeneratedImage(data.generatedImage);
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            router.push("/auth/login?redirect=/visualize");
            return;
        }
        if (!uploadedImage || !generatedImage) {
            toast.error("Generate an image before saving");
            return;
        }

        try {
            setIsSaving(true);
            await createManifestation(
                user.id,
                uploadedImage,
                generatedImage,
                selectedDreams,
                getRandomAffirmation()
            );
            toast.success("Saved to your vision board");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save";
            toast.error("Could not save this vision", {
                description: message,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartOver = () => {
        setStep(1);
        setUploadedImage(null);
        setSelectedDreams([]);
        setGeneratedImage(null);
        setIsGenerating(false);
        setIsSaving(false);
        setVisionDescription("");
    };

    // Show loading state while checking auth
    if (authLoading) {
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
        <div className="relative min-h-screen bg-dreamr-gradient">
            {/* Navigation Header */}
            <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8D5C4]/70 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="font-serif text-lg uppercase tracking-[0.3em] text-[#B89B7A]"
                    >
                        Dreamr
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
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
                    </nav>
                </div>
            </header>

            {/* Main Content with top padding for fixed header */}
            <div className="pt-16">
                {step === 1 && (
                    <UploadStep
                        uploadedImage={uploadedImage}
                        onImageUpload={handleImageUpload}
                        onNext={handleNextFromUpload}
                    />
                )}
                {step === 2 && (
                    <DreamSelectionStep
                        selectedDreams={selectedDreams}
                        onToggleDream={handleToggleDream}
                        onNext={handleNextFromDreamSelection}
                        visionDescription={visionDescription}
                        onVisionDescriptionChange={setVisionDescription}
                    />
                )}
                {step === 3 && (
                    <RevealStep
                        originalImage={uploadedImage!}
                        generatedImage={generatedImage}
                        selectedDreams={selectedDreams}
                        onSave={handleSave}
                        onStartOver={handleStartOver}
                        isGenerating={isGenerating}
                        isSaving={isSaving}
                    />
                )}
            </div>
        </div>
    );
}

export default function VisualPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VisualContent />
        </Suspense>
    );
}