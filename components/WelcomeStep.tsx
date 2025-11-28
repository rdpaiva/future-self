"use client";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[4px] text-[#B89B7A] mb-5">
        Welcome to
      </div>

      <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-[#3D3225] mb-6 tracking-tight text-center">
        Manifestr
      </h1>

      <p className="text-lg md:text-xl text-[#7A6B5A] max-w-[480px] text-center leading-relaxed mb-14 font-light">
        See your future self. Believe in your potential.
        <br />
        <span className="italic text-[#B89B7A]">Manifest your dreams.</span>
      </p>

      <button
        onClick={onNext}
        className="bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-white border-none px-14 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-[0_10px_40px_rgba(212,165,116,0.4)] transition-all duration-400 hover:translate-y-[-3px] hover:shadow-[0_15px_50px_rgba(212,165,116,0.5)] animate-pulse-glow"
      >
        Begin Your Journey
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 0 ? 'w-6 bg-[#D4A574]' : 'w-2 bg-[#D4A574]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
