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
        const result = reader.result as string;

        // Create an image element to load the file data
        const img = new Image();
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // Convert to JPEG format which is supported by Gemini
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            onImageUpload(jpegDataUrl);
          } else {
            // Fallback if canvas context fails
            onImageUpload(result);
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[3px] text-dreamr-text-accent mb-4">
        Step 1 of 3
      </div>

      <h2 className="text-4xl md:text-5xl font-light text-dreamr-text-dark mb-4 text-center">
        Upload Your Photo
      </h2>

      <p className="text-lg text-dreamr-text mb-12 font-light text-center">
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
        className={`w-[280px] h-[340px] rounded-[200px_200px_140px_140px] cursor-pointer transition-all duration-400 overflow-hidden relative ${uploadedImage
          ? 'shadow-dreamr-lg hover:shadow-dreamr-card hover:scale-[1.02]'
          : 'border-2 border-dashed border-dreamr-gold bg-gradient-to-b from-dreamr-gold/[0.08] to-dreamr-gold/[0.15] shadow-dreamr-lg hover:shadow-dreamr-gold hover:scale-[1.02]'
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
            <div className="w-16 h-16 rounded-full bg-dreamr-gold/15 flex items-center justify-center mb-5">
              <Camera className="w-7 h-7 text-dreamr-text-accent" />
            </div>
            <span className="text-dreamr-text-accent text-base font-sans">
              Tap to upload
            </span>
          </div>
        )}
        {uploadedImage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-5 py-2 rounded-full text-xs font-sans text-dreamr-text">
            Tap to change
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!uploadedImage}
        className={`mt-12 border-none px-12 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full transition-all duration-300 ${uploadedImage
          ? 'bg-dreamr-button text-white cursor-pointer shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px]'
          : 'bg-dreamr-gold/30 text-white cursor-not-allowed'
          }`}
      >
        Continue
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${i === 1 ? 'w-6 bg-dreamr-gold' : i < 1 ? 'w-2 bg-dreamr-gold' : 'w-2 bg-dreamr-gold/30'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
