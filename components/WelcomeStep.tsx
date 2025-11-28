"use client";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 animate-fade-in">
      <div className="text-xs font-sans uppercase tracking-[4px] text-dreamr-text-accent mb-5">
        Welcome to
      </div>

      <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-dreamr-text-dark mb-6 tracking-tight text-center">
        Dreamr
      </h1>

      <p className="text-lg md:text-xl text-dreamr-text max-w-[480px] text-center leading-relaxed mb-14 font-light">
        See your future self. Believe in your potential.
        <br />
        <span className="italic text-dreamr-text-accent">Manifest your dreams.</span>
      </p>

      <button
        onClick={onNext}
        className="bg-dreamr-button text-white border-none px-14 py-5 text-sm font-sans tracking-[2px] uppercase rounded-full cursor-pointer shadow-dreamr-gold transition-all duration-400 hover:translate-y-[-3px] hover:shadow-dreamr-gold-lg animate-pulse-glow"
      >
        Begin Your Journey
      </button>

      <div className="fixed bottom-10 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded transition-all duration-300 ${
              i === 0 ? 'w-6 bg-dreamr-gold' : 'w-2 bg-dreamr-gold/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
