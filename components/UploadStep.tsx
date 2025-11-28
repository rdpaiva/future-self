"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

interface UploadStepProps {
  uploadedImage: string | null;
  onImageUpload: (image: string) => void;
  onNext: () => void;
}

export default function UploadStep({
  uploadedImage,
  onImageUpload,
  onNext,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[3px] text-[#B89B7A] mb-4">
        Step 1 of 3
      </div>

      <h2 className="text-4xl md:text-5xl font-light text-[#3D3225] mb-4 text-center">
        Show Us You
      </h2>

      <p className="text-lg text-[#7A6B5A] mb-12 font-light text-center">
        Upload a photo to begin visualizing your future self
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-[280px] h-[340px] rounded-[200px_200px_140px_140px] cursor-pointer transition-all duration-400 overflow-hidden relative ${
          uploadedImage
            ? 'shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.2)] hover:scale-[1.02]'
            : 'border-2 border-dashed border-[#D4A574] bg-gradient-to-b from-[rgba(212,165,116,0.08)] to-[rgba(212,165,116,0.15)] shadow-[0_10px_40px_rgba(212,165,116,0.15)] hover:shadow-[0_15px_50px_rgba(212,165,116,0.25)] hover:scale-[1.02]'
        }`}
        style={
          uploadedImage
            ? {
                backgroundImage: `url(${uploadedImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {!uploadedImage && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-[rgba(212,165,116,0.15)] flex items-center justify-center mb-5">
              <Camera className="w-7 h-7 text-[#B89B7A]" />
            </div>
            <span className="text-[#B89B7A] text-base font-sans">
              Tap to upload
            </span>
          </div>
        )}
        {uploadedImage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-5 py-2 rounded-full text-xs font-sans text-[#7A6B5A]">
            Tap to change
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!uploadedImage}
        className={`mt-12 border-none px-12 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full transition-all duration-300 ${
          uploadedImage
            ? 'bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white cursor-pointer shadow-[0_8px_30px_rgba(212,165,116,0.4)] hover:shadow-[0_12px_40px_rgba(212,165,116,0.5)] hover:translate-y-[-2px]'
            : 'bg-[rgba(212,165,116,0.3)] text-white cursor-not-allowed'
        }`}
      >
        Continue
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 1 ? 'w-6 bg-[#D4A574]' : i < 1 ? 'w-2 bg-[#D4A574]' : 'w-2 bg-[#D4A574]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
