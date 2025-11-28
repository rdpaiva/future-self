"use client";

import { useState } from "react";
import { dreams } from "@/lib/constants";
import { Loader2, Download, Share2 } from "lucide-react";

interface RevealStepProps {
  originalImage: string;
  generatedImage: string | null;
  selectedDreams: string[];
  onSave: () => void;
  onStartOver: () => void;
  isGenerating: boolean;
  isSaving?: boolean;
}

export default function RevealStep({
  originalImage,
  generatedImage,
  selectedDreams,
  onSave,
  onStartOver,
  isGenerating,
  isSaving = false,
}: RevealStepProps) {
  const selectedDreamObjects = dreams.filter((d) =>
    selectedDreams.includes(d.id)
  );

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `dreamr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayImage = generatedImage || originalImage;

  return (
    <div className="flex min-h-screen flex-col items-center px-5 py-14 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[3px] text-dreamr-text-accent mb-4">
        Your Vision
      </div>

      <h2 className="text-4xl md:text-5xl font-light text-dreamr-text-dark mb-10 text-center">
        Meet Your Future Self
      </h2>

      <div className="relative mb-10">
        {/* Glow effect */}
        <div className="absolute inset-[-20px] bg-dreamr-glow-1 rounded-full blur-[30px] animate-pulse" />

        <div
          className="w-[240px] h-[300px] rounded-[160px_160px_120px_120px] shadow-dreamr-card relative overflow-hidden"
          style={{
            backgroundImage: `url(${displayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-b from-dreamr-gold/90 to-dreamr-gold-dark/90 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4 mx-auto" />
                <p className="text-white font-sans text-sm">Creating your vision...</p>
              </div>
            </div>
          )}

          {/* Golden overlay */}
          {!isGenerating && generatedImage && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-dreamr-gold/10 to-dreamr-gold-light/15 mix-blend-overlay" />
              {/* Sparkle effects */}
              <div className="absolute top-[20%] right-[15%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.8)] animate-float" />
              <div
                className="absolute bottom-[30%] left-[10%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-float"
                style={{ animationDelay: '0.5s' }}
              />
            </>
          )}
        </div>
      </div>

      {/* Selected dreams badges */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-10 max-w-[400px]">
        {selectedDreamObjects.map((dream) => (
          <div
            key={dream.id}
            className="bg-dreamr-gold/15 px-4 py-2.5 rounded-[25px] flex items-center gap-2 text-sm text-dreamr-text font-sans"
          >
            <span>{dream.icon}</span>
            <span>{dream.title}</span>
          </div>
        ))}
      </div>

      {/* Affirmation card */}
      <div className="bg-dreamr-bg-card backdrop-blur-sm rounded-3xl px-10 py-8 max-w-[440px] text-center shadow-dreamr mb-10">
        <p className="text-xl md:text-2xl text-dreamr-text-dark font-normal italic leading-relaxed">
          "This is the version of you that already exists. All you have to do is
          believe."
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={onSave}
          disabled={isGenerating || !generatedImage || isSaving}
          className="bg-dreamr-button text-white border-none px-12 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-dreamr-gold transition-all duration-300 hover:translate-y-[-2px] hover:shadow-dreamr-gold-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save to My Vision Board"
          )}
        </button>

        {generatedImage && !isGenerating && (
          <button
            onClick={handleDownload}
            className="bg-dreamr-bg-card text-dreamr-text border border-dreamr-gold/30 px-8 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-dreamr-sm transition-all duration-300 hover:shadow-dreamr-gold hover:translate-y-[-2px] flex items-center gap-2 justify-center"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
      </div>

      <button
        onClick={onStartOver}
        className="bg-transparent border-none text-dreamr-text-accent text-sm font-sans cursor-pointer underline underline-offset-4 hover:text-dreamr-gold transition-colors"
      >
        Start Over
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 3 ? 'w-6 bg-dreamr-gold' : 'w-2 bg-dreamr-gold'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
