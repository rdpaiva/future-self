"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, Upload, X } from "lucide-react";

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      if (isCameraOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Unable to access camera. Please make sure you have granted permission.");
          setIsCameraOpen(false);
        }
      }
    };

    if (isCameraOpen) {
      initCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onImageUpload(jpegDataUrl);
        setIsCameraOpen(false);
      }
    }
  };

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
        onClick={() => !isCameraOpen && fileInputRef.current?.click()}
        className={`w-[280px] h-[340px] rounded-[200px_200px_140px_140px] transition-all duration-400 overflow-hidden relative ${isCameraOpen
            ? 'shadow-dreamr-lg bg-black'
            : uploadedImage
              ? 'cursor-pointer shadow-dreamr-lg hover:shadow-dreamr-card hover:scale-[1.02]'
              : 'cursor-pointer border-2 border-dashed border-dreamr-gold bg-gradient-to-b from-dreamr-gold/[0.08] to-dreamr-gold/[0.15] shadow-dreamr-lg hover:shadow-dreamr-gold hover:scale-[1.02]'
          }`}
        style={
          uploadedImage && !isCameraOpen
            ? {
              backgroundImage: `url(${uploadedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
            : undefined
        }
      >
        {isCameraOpen ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <>
            {!uploadedImage && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-dreamr-gold/15 flex items-center justify-center mb-5">
                  <Upload className="w-7 h-7 text-dreamr-text-accent" />
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
          </>
        )}
      </div>

      {isCameraOpen ? (
        <div className="flex gap-8 mt-8 items-center">
          <button
            onClick={() => setIsCameraOpen(false)}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-4 border-dreamr-gold flex items-center justify-center hover:bg-dreamr-gold/10 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-dreamr-gold" />
          </button>
          <div className="w-12" />
        </div>
      ) : (
        <>
          {!uploadedImage && (
            <button
              onClick={() => setIsCameraOpen(true)}
              className="mt-6 flex items-center gap-2 text-dreamr-text-accent hover:text-dreamr-gold transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span className="text-sm font-sans uppercase tracking-widest">
                Or take a selfie
              </span>
            </button>
          )}

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
        </>
      )}

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
