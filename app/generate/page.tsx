"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import WelcomeStep from "@/components/WelcomeStep";
import UploadStep from "@/components/UploadStep";
import DreamSelectionStep from "@/components/DreamSelectionStep";
import RevealStep from "@/components/RevealStep";
import { dreams, affirmations } from "@/lib/constants";
import { createManifestation } from "@/lib/supabase/manifestations";
import { useAuth } from "@/contexts/AuthContext";

const dreamPromptLookup = dreams.reduce<Record<string, string>>((acc, dream) => {
    acc[dream.id] = dream.prompt;
    return acc;
}, {});

const getRandomAffirmation = () =>
    affirmations[Math.floor(Math.random() * affirmations.length)] ?? affirmations[0];

function GenerateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    const [step, setStep] = useState(0);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const fromProfileParam = searchParams?.get("fromProfile") === "true";

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedImage = window.sessionStorage.getItem("preselectedImage");
        if (storedImage) {
            setUploadedImage(storedImage);
            setStep(2);
            window.sessionStorage.removeItem("preselectedImage");
            if (fromProfileParam) {
                toast.success("Loaded your profile photo");
            }
            return;
        }

        if (fromProfileParam) {
            toast.warning("We couldn't load your photo. Please upload it again.");
        }
    }, [fromProfileParam]);

    const toggleDream = (id: string) => {
        setSelectedDreams((prev) =>
            prev.includes(id) ? prev.filter((dreamId) => dreamId !== id) : [...prev, id]
        );
    };

    const goToUploadStep = () => {
        setStep(1);
    };

    const handleUploadNext = () => {
        if (!uploadedImage) {
            toast.error("Upload a photo to continue");
            return;
        }
        setStep(2);
    };

    const runGeneration = async () => {
        if (!uploadedImage || selectedDreams.length === 0) {
            toast.error("Select a photo and at least one dream to generate");
            return;
        }

        setGenerationError(null);
        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const promptPayload = selectedDreams
                .map((id) => dreamPromptLookup[id])
                .filter((prompt): prompt is string => Boolean(prompt));

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: uploadedImage, dreams: promptPayload }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "Failed to generate image");
            }

            setGeneratedImage(data.generatedImage);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            setGenerationError(message);
            toast.error("We couldn't complete that generation", {
                description: message,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDreamsNext = () => {
        if (!uploadedImage) {
            toast.error("Upload a photo first");
            setStep(1);
            return;
        }
        setStep(3);
        runGeneration();
    };

    const handleSave = async () => {
        if (!user) {
            router.push("/auth/login");
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
        setGeneratedImage(null);
        setSelectedDreams([]);
        setGenerationError(null);
        setIsGenerating(false);
        setStep(1);
    };

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

    if (!user) return null;

    const renderStep = () => {
        switch (step) {
            case 0:
                return <WelcomeStep onNext={goToUploadStep} />;
            case 1:
                return (
                    <UploadStep
                        uploadedImage={uploadedImage}
                        onImageUpload={setUploadedImage}
                        onNext={handleUploadNext}
                    />
                );
            case 2:
                return (
                    <DreamSelectionStep
                        selectedDreams={selectedDreams}
                        onToggleDream={toggleDream}
                        onNext={handleDreamsNext}
                    />
                );
            case 3:
                return (
                    <RevealStep
                        originalImage={uploadedImage || ""}
                        generatedImage={generatedImage}
                        selectedDreams={selectedDreams}
                        onSave={handleSave}
                        onStartOver={handleStartOver}
                        isGenerating={isGenerating}
                        isSaving={isSaving}
                    />
                );
            default:
                return <WelcomeStep onNext={goToUploadStep} />;
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-dreamr-gradient text-dreamr-text">
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-dreamr-glow-1 rounded-full pointer-events-none" />
            <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-dreamr-glow-2 rounded-full pointer-events-none" />

            <div className="relative z-10">
                {generationError && (
                    <div className="max-w-xl mx-auto mt-6 px-4">
                        <div className="bg-white/80 border border-red-200 text-red-700 rounded-2xl px-6 py-4 text-sm font-sans shadow-dreamr-sm">
                            {generationError}
                        </div>
                    </div>
                )}
                {renderStep()}
            </div>
        </main>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GenerateContent />
        </Suspense>
    );
}
