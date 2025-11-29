"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UploadStep from "@/components/UploadStep";
import DreamSelectionStep from "@/components/DreamSelectionStep";
import RevealStep from "@/components/RevealStep";
import { useAuth } from "@/contexts/AuthContext";
import { createManifestation } from "@/lib/supabase/manifestations";
import { affirmations } from "@/lib/constants";

export default function VisualizePage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

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
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: uploadedImage,
                    dreams: selectedDreams,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            setGeneratedImage(data.generatedImage);
        } catch (error) {
            console.error('Error generating image:', error);
            toast.error("Failed to generate image", {
                description: "Please try again.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            toast.error("Please sign in to save", {
                description: "You need to be logged in to save to your vision board.",
            });
            router.push("/auth/login");
            return;
        }

        if (!uploadedImage || !generatedImage) {
            toast.error("Missing images", {
                description: "Both original and generated images are required.",
            });
            return;
        }

        setIsSaving(true);

        try {
            // Pick a random affirmation
            const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

            await createManifestation(
                user.id,
                uploadedImage,
                generatedImage,
                selectedDreams,
                randomAffirmation
            );

            toast.success("Saved to your vision board!", {
                description: "View it in your vision board.",
            });

            // Navigate to the vision board after saving
            router.push("/board");
        } catch (error) {
            console.error('Error saving manifestation:', error);
            toast.error("Failed to save", {
                description: "Please try again.",
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
    };

    return (
        <div>
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
    );
}
