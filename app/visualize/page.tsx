"use client";

import { useState, useEffect } from "react";
import UploadStep from "@/components/UploadStep";
import DreamSelectionStep from "@/components/DreamSelectionStep";
import RevealStep from "@/components/RevealStep";

export default function VisualPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate saving
        setTimeout(() => {
            setIsSaving(false);
            console.log("Saved to vision board");
        }, 2000);
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