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
    link.download = `manifestr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayImage = generatedImage || originalImage;

  return (
    <div className="flex min-h-screen flex-col items-center px-5 py-14 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[3px] text-[#B89B7A] mb-4">
        Your Vision
      </div>

      <h2 className="text-4xl md:text-5xl font-light text-[#3D3225] mb-10 text-center">
        Meet Your Future Self
      </h2>

      <div className="relative mb-10">
        {/* Glow effect */}
        <div className="absolute inset-[-20px] bg-[radial-gradient(circle,rgba(212,165,116,0.4)_0%,transparent_70%)] rounded-full blur-[30px] animate-pulse" />

        <div
          className="w-[240px] h-[300px] rounded-[160px_160px_120px_120px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] relative overflow-hidden"
          style={{
            backgroundImage: `url(${displayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(212,165,116,0.9)] to-[rgba(196,149,106,0.9)] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4 mx-auto" />
                <p className="text-white font-sans text-sm">Creating your vision...</p>
              </div>
            </div>
          )}

          {/* Golden overlay */}
          {!isGenerating && generatedImage && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(212,165,116,0.1)] to-[rgba(255,215,150,0.15)] mix-blend-overlay" />
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
            className="bg-[rgba(212,165,116,0.15)] px-4 py-2.5 rounded-[25px] flex items-center gap-2 text-sm text-[#7A6B5A] font-sans"
          >
            <span>{dream.icon}</span>
            <span>{dream.title}</span>
          </div>
        ))}
      </div>

      {/* Affirmation card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-10 py-8 max-w-[440px] text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)] mb-10">
        <p className="text-xl md:text-2xl text-[#3D3225] font-normal italic leading-relaxed">
          "This is the version of you that already exists. All you have to do is
          believe."
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={onSave}
          disabled={isGenerating || !generatedImage || isSaving}
          className="bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white border-none px-12 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-[0_10px_40px_rgba(212,165,116,0.4)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_15px_50px_rgba(212,165,116,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            className="bg-white/70 text-[#7A6B5A] border border-[#D4A574]/30 px-8 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,165,116,0.2)] hover:translate-y-[-2px] flex items-center gap-2 justify-center"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
      </div>

      <button
        onClick={onStartOver}
        className="bg-transparent border-none text-[#B89B7A] text-sm font-sans cursor-pointer underline underline-offset-4 hover:text-[#D4A574] transition-colors"
      >
        Start Over
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 3 ? 'w-6 bg-[#D4A574]' : 'w-2 bg-[#D4A574]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
