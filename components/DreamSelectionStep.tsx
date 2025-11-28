"use client";

import { useState } from "react";
import { dreams, affirmations } from "@/lib/constants";
import { Check } from "lucide-react";

interface DreamSelectionStepProps {
  selectedDreams: string[];
  onToggleDream: (id: string) => void;
  onNext: () => void;
}

export default function DreamSelectionStep({
  selectedDreams,
  onToggleDream,
  onNext,
}: DreamSelectionStepProps) {
  const [isRevealing, setIsRevealing] = useState(false);

  const handleReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-5 py-14 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[3px] text-dreamr-text-accent mb-4">
        Step 2 of 3
      </div>

      <h2 className="text-4xl md:text-5xl font-light text-dreamr-text-dark mb-4 text-center">
        What Do You Dream Of?
      </h2>

      <p className="text-lg text-dreamr-text mb-12 font-light text-center max-w-[400px]">
        Select the areas of life you want to visualize for your future self
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[560px] w-full mb-12">
        {dreams.map((dream, index) => {
          const isSelected = selectedDreams.includes(dream.id);
          return (
            <div
              key={dream.id}
              onClick={() => onToggleDream(dream.id)}
              className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 relative animate-fade-in ${
                isSelected
                  ? 'bg-dreamr-button shadow-dreamr-gold scale-[1.02]'
                  : 'bg-dreamr-bg-card border border-dreamr-gold/20 shadow-dreamr-sm hover:shadow-dreamr-gold hover:scale-[1.02]'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className={`text-3xl mb-3 transition-all ${
                  isSelected ? 'brightness-110' : ''
                }`}
              >
                {dream.icon}
              </div>
              <div
                className={`text-base font-medium mb-1 ${
                  isSelected ? 'text-white' : 'text-dreamr-text-dark'
                }`}
              >
                {dream.title}
              </div>
              <div
                className={`text-xs font-sans leading-relaxed ${
                  isSelected ? 'text-white/85' : 'text-dreamr-text-light'
                }`}
              >
                {dream.description}
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleReveal}
        disabled={selectedDreams.length === 0 || isRevealing}
        className={`border-none px-12 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full transition-all duration-300 ${
          selectedDreams.length > 0
            ? 'bg-dreamr-button text-white cursor-pointer shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px]'
            : 'bg-dreamr-gold/30 text-white cursor-not-allowed'
        }`}
      >
        {isRevealing ? 'Manifesting...' : 'Reveal My Future Self'}
      </button>

      {isRevealing && (
        <div className="fixed inset-0 bg-dreamr-bg-cream/[0.97] flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-dreamr-button mb-8 animate-pulse" />
          <p className="text-2xl text-dreamr-text-dark font-light italic px-6 text-center">
            {affirmations[Math.floor(Math.random() * affirmations.length)]}
          </p>
        </div>
      )}

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 2 ? 'w-6 bg-dreamr-gold' : i < 2 ? 'w-2 bg-dreamr-gold' : 'w-2 bg-dreamr-gold/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
