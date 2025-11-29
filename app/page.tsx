"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Download,
  Dumbbell,
  Globe,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  LayoutGrid,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const heroMicrocopy = [
  "Private and secure. Your photos are never public.",
  "No model training on your face. Delete anytime.",
];

const howItWorksSteps = [
  {
    title: "Upload your photo",
    description:
      "Upload one or more clear photos of yourself. Your face stays private and is only used to generate your future images.",
  },
  {
    title: "Choose your future path",
    description:
      "Pick what you want to explore first: Wealth & Career, Health & Fitness, or Adventure & Lifestyle.",
  },
  {
    title: "Generate your future self",
    description:
      "In seconds, see a realistic future version of you that reflects the direction you want to go.",
  },
  {
    title: "Save it to your vision board (Pro)",
    description:
      "Keep your favorite future selves in a private vision board so you can come back, focus, and refine your path.",
  },
];

const featureGrid = [
  {
    icon: Upload,
    title: "Future-self image generation",
    description:
      "Upload your photo and generate future versions of yourself with realistic changes in confidence, lifestyle, and presence.",
  },
  {
    icon: ArrowRight,
    title: "Future paths: wealth, health, adventure",
    description:
      "Explore different directions of your life: financial growth, physical transformation, or a more adventurous lifestyle.",
  },
  {
    icon: Sparkles,
    title: "Positive visualization prompts",
    description:
      "Each future image is paired with a short, positive prompt to help you visualize how you got there and what it feels like to live that life.",
  },
  {
    icon: Briefcase,
    title: "Private vision board (Pro)",
    description:
      "Save your favorite future selves to a private vision board that you can revisit whenever you need clarity and motivation.",
  },
  {
    icon: Download,
    title: "HD exports (Pro)",
    description:
      "Export high-quality images of your future self for your phone background, journal, or personal vision deck.",
  },
];

const useCases = [
  {
    icon: Briefcase,
    title: "The focused, high-earning you",
    description:
      "Visualize the version of you who’s leveled up their career or business, feels in control of their time, and lives with financial confidence.",
  },
  {
    icon: Dumbbell,
    title: "The strong, disciplined you",
    description:
      "See yourself healthier, stronger, and more energized. Use that image to anchor better choices in your day-to-day life.",
  },
  {
    icon: Globe,
    title: "The adventurous, free you",
    description:
      "Picture yourself traveling more, exploring new places, and saying yes to experiences you used to put off for later.",
  },
];

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    priceNote: "",
    features: [
      "1 photo upload",
      "1 future-self generation",
      "Low-resolution preview",
      "No saving to vision board",
    ],
    ctaLabel: "Start Free",
    emphasis: "secondary" as const,
  },
  {
    id: "pro",
    name: "Dreamr Pro",
    price: "TBD",
    priceNote: "One-time unlock or monthly plan. You choose.",
    features: [
      "Unlimited generations",
      "All future paths: wealth, health, adventure",
      "Private vision board",
      "HD image exports",
      "Enhanced positive visualization prompts",
    ],
    ctaLabel: "Unlock Pro",
    emphasis: "primary" as const,
  },
];

const privacyPoints = [
  "Your photos are never public.",
  "Your images are used only to generate your future selves.",
  "We don’t sell your data or train generic models on your face.",
  "You can delete your photos and generated images at any time.",
];

const finalCtaBody = [
  "The question isn’t whether the future will arrive.",
  "The question is whether you’ll recognize the person you’ve become.",
  "See your future self, and start building toward them today.",
];

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const handleScrollTo = (target: string) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenerateMyFuture = () => {
    if (user) {
      router.push("/visualize");
    } else {
      router.push("/auth/login?redirect=/visualize");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FEF3E8] to-[#FDF0E6] text-[#3D3225] font-sans">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.25)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-30%] left-[-15%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(196,149,106,0.2)_0%,transparent_70%)]" />
      </div>
      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8D5C4]/70 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="font-serif text-lg uppercase tracking-[0.3em] text-[#B89B7A]">
              Dreamr
            </div>
            <nav className="hidden items-center gap-6 text-sm text-[#7A6B5A] md:flex">
              <button className="transition hover:text-[#3D3225]" onClick={() => handleScrollTo("how-it-works")}>
                How it works
              </button>
              <button className="transition hover:text-[#3D3225]" onClick={() => handleScrollTo("features")}>
                Features
              </button>
              <button className="transition hover:text-[#3D3225]" onClick={() => handleScrollTo("use-cases")}>
                Use cases
              </button>
              <button className="transition hover:text-[#3D3225]" onClick={() => handleScrollTo("pricing")}>
                Pricing
              </button>
              {!authLoading && user ? (
                <>
                  <Link href="/profile" className="inline-flex items-center gap-1 transition hover:text-[#3D3225]">
                    <User className="h-4 w-4" />
                    Your Photos
                  </Link>
                  <Link href="/board" className="inline-flex items-center gap-1 transition hover:text-[#3D3225]">
                    <LayoutGrid className="h-4 w-4" />
                    Vision Board
                  </Link>
                  <button onClick={signOut} className="inline-flex items-center gap-1 transition hover:text-[#3D3225]">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : !authLoading ? (
                <Link href="/auth/login" className="text-[#B89B7A] transition hover:text-[#3D3225]">
                  Sign in
                </Link>
              ) : null}
            </nav>
            {!authLoading && user ? (
              <button
                onClick={handleGenerateMyFuture}
                className="rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(212,165,116,0.35)] transition hover:shadow-[0_14px_40px_rgba(212,165,116,0.45)]"
              >
                Create Now
              </button>
            ) : !authLoading ? (
              <Link
                href="/auth/signup"
                className="rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(212,165,116,0.35)] transition hover:shadow-[0_14px_40px_rgba(212,165,116,0.45)]"
              >
                Start Free
              </Link>
            ) : null}
          </div>
        </header>

        <div className="pt-24 md:pt-28">
          <section id="hero" className="overflow-hidden border-b border-[#F0E2D3]/80 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
              <div className="space-y-8">
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">
                  Visualize it. Build it.
                </p>
                <h1 className="font-serif text-4xl leading-tight text-[#3D3225] sm:text-5xl">
                  Your future doesn’t happen by accident.
                  <br />
                  Visualize it. Build it.
                </h1>
                <p className="text-lg text-[#7A6B5A]">
                  Upload your photo and generate realistic future versions of yourself across wealth, fitness, and adventure.
                  Train your mind to see the life you’re building.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={handleGenerateMyFuture}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_35px_rgba(212,165,116,0.45)] transition hover:shadow-[0_16px_45px_rgba(212,165,116,0.55)]"
                  >
                    Generate My Future
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleScrollTo("how-it-works")}
                    className="rounded-full border border-[#D9C3AE] px-8 py-3 text-base font-semibold text-[#7A6B5A] transition hover:border-[#C49C6A] hover:text-[#3D3225]"
                  >
                    See You in 5 Years
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-[#7A6B5A]">
                  {heroMicrocopy.map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4A574]" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[48px] bg-gradient-to-br from-[#FDE7D9] via-[#FBE1D1] to-[#F2D3C2] blur-3xl" />
                <div className="relative rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_25px_80px_rgba(212,165,116,0.25)] backdrop-blur">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm text-[#9A8B7A]">You today</p>
                      <div className="relative h-72 overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-inner">
                        <Image
                          src="/images/before.jpg"
                          alt="Current you before using Dreamr"
                          fill
                          sizes="(max-width: 1024px) 100vw, 320px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-[#9A8B7A]">You in 5 years</p>
                      <div className="relative h-72 overflow-hidden rounded-3xl border border-white/60 bg-[#FFEBDD]/80 shadow-[0_20px_50px_rgba(212,165,116,0.35)]">
                        <Image
                          src="/images/after.jpeg"
                          alt="Future you after taking action"
                          fill
                          sizes="(max-width: 1024px) 100vw, 320px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-[#7A6B5A]">
                    Current selfie on the left, AI-generated future self on the right.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div id="upload-or-how-it-works">
            <section id="how-it-works" className="border-b border-[#F0E2D3]/80 bg-gradient-to-b from-white/70 to-transparent scroll-mt-24 md:scroll-mt-32">
              <div className="mx-auto max-w-6xl px-6 py-24">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">Process</p>
                  <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">How it works</h2>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                  {howItWorksSteps.map((step, index) => (
                    <div key={step.title} className="rounded-3xl border border-[#E7D6C5] bg-white/80 p-8 shadow-[0_20px_60px_rgba(212,165,116,0.15)]">
                      <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[#B89B7A]">
                        <span>Step {index + 1}</span>
                        <span className="text-[#7A6B5A]">{step.title}</span>
                      </div>
                      <p className="mt-4 text-base text-[#7A6B5A]">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section id="why-visualization" className="border-b border-[#F0E2D3]/80 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">Mindset</p>
                <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">
                  What you repeatedly visualize, you move toward
                </h2>
              </div>
              <div className="space-y-6 text-lg text-[#7A6B5A]">
                <p>
                  High performers, athletes, and leaders have used visualization for decades. When your mind can clearly see the future, your actions naturally start aligning with it.
                </p>
                <p>
                  Dreamr makes visualization concrete and personal. Instead of vague daydreaming, you’re looking at a future version of yourself and asking:
                </p>
                <div className="rounded-3xl border border-[#E7D6C5] bg-gradient-to-b from-white to-[#FFF5EC] p-6 text-[#3D3225] shadow-[0_20px_50px_rgba(212,165,116,0.15)]">
                  <p className="italic">“What choices get me there?”</p>
                  <p className="italic">“What habits make this normal?”</p>
                  <p className="italic">“What would it feel like to live like this?”</p>
                </div>
                <p>
                  Your future starts in your mind, then shows up in your behavior, then in your results. Dreamr helps you start with a clear picture.
                </p>
              </div>
            </div>
          </section>

          <section id="features" className="border-b border-[#F0E2D3]/80 bg-white/70 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">Product</p>
                <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">Built for focused transformation</h2>
              </div>
              <div className="mt-16 grid gap-6 md:grid-cols-2">
                {featureGrid.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="rounded-3xl border border-[#E7D6C5] bg-white p-8 shadow-[0_20px_60px_rgba(212,165,116,0.15)]">
                    <Icon className="h-6 w-6 text-[#C4956A]" />
                    <h3 className="mt-4 text-xl font-semibold text-[#3D3225]">{title}</h3>
                    <p className="mt-2 text-[#7A6B5A]">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="use-cases" className="border-b border-[#F0E2D3]/80 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">Intentions</p>
                <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">See the life you’re building</h2>
              </div>
              <div className="mt-16 grid gap-6 md:grid-cols-3">
                {useCases.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="rounded-3xl border border-[#E7D6C5] bg-white/80 p-6 shadow-[0_12px_40px_rgba(212,165,116,0.18)]">
                    <Icon className="h-6 w-6 text-[#C4956A]" />
                    <h3 className="mt-4 text-xl font-semibold text-[#3D3225]">{title}</h3>
                    <p className="mt-2 text-[#7A6B5A]">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-[#7A6B5A]">
                Every version starts with a picture in your mind. Dreamr just makes that picture clearer.
              </p>
            </div>
          </section>

          <section id="pricing" className="border-b border-[#F0E2D3]/80 bg-white/80 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">Plans</p>
                <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">Start free. Unlock your full future.</h2>
                <p className="mt-4 text-[#7A6B5A]">
                  Try Dreamr with a free first generation, then unlock the full experience when you’re ready.
                </p>
              </div>
              <div className="mt-16 grid gap-8 md:grid-cols-2">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="flex flex-col rounded-3xl border border-[#E7D6C5] bg-white p-8 shadow-[0_25px_70px_rgba(212,165,116,0.18)]">
                    <div className="text-sm uppercase tracking-[0.2em] text-[#B89B7A]">{plan.name}</div>
                    <div className="mt-6 text-5xl font-semibold text-[#3D3225]">${plan.price}</div>
                    {plan.priceNote && (
                      <p className="mt-2 text-sm text-[#7A6B5A]">{plan.priceNote}</p>
                    )}
                    <ul className="mt-8 space-y-3 text-[#7A6B5A]">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#C4956A]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`mt-10 rounded-full px-6 py-3 text-sm font-semibold transition ${plan.emphasis === "primary"
                        ? "bg-gradient-to-r from-[#D4A574] to-[#C4956A] text-white shadow-[0_12px_35px_rgba(212,165,116,0.4)] hover:shadow-[0_16px_45px_rgba(212,165,116,0.5)]"
                        : "border border-[#D9C3AE] text-[#7A6B5A] hover:border-[#C49C6A] hover:text-[#3D3225]"
                        }`}
                    >
                      {plan.ctaLabel}
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-[#7A6B5A]">
                Cancel anytime. Your data stays under your control.
              </p>
            </div>
          </section>

          <section id="privacy" className="border-b border-[#F0E2D3]/80 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto max-w-6xl px-6 py-24">
              <div className="rounded-3xl border border-[#E7D6C5] bg-white/85 p-10 shadow-[0_25px_70px_rgba(212,165,116,0.2)]">
                <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">
                  Privacy first
                </p>
                <h2 className="mt-4 font-serif text-3xl text-[#3D3225]">
                  Your face. Your data. Your control.
                </h2>
                <p className="mt-6 text-[#7A6B5A]">
                  We know you’re trusting us with something personal. We take that seriously.
                </p>
                <ul className="mt-6 space-y-3 text-[#3D3225]">
                  {privacyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 text-[#C4956A]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[#7A6B5A]">Dreamr is built for confidence, not comparison.</p>
              </div>
            </div>
          </section>

          <section id="final-cta" className="border-b border-[#F0E2D3]/80 bg-white/70 scroll-mt-24 md:scroll-mt-32">
            <div className="mx-auto max-w-4xl px-6 py-24 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-[#B89B7A]">
                Commitment
              </p>
              <h2 className="mt-4 font-serif text-4xl text-[#3D3225]">
                Five years from now is coming either way.
              </h2>
              <div className="mt-6 space-y-2 text-lg text-[#7A6B5A]">
                {finalCtaBody.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => handleScrollTo("hero")}
                  className="rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4956A] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_35px_rgba(212,165,116,0.45)] transition hover:shadow-[0_16px_45px_rgba(212,165,116,0.55)]"
                >
                  Visualize My Future Now
                </button>
                <button
                  onClick={() => handleScrollTo("how-it-works")}
                  className="rounded-full border border-[#D9C3AE] px-8 py-3 text-base font-semibold text-[#7A6B5A] transition hover:border-[#C49C6A] hover:text-[#3D3225]"
                >
                  Learn how Dreamr works
                </button>
              </div>
            </div>
          </section>

          <footer id="footer" className="border-b border-[#F0E2D3]/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-[#7A6B5A] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-serif text-lg text-[#3D3225]">Dreamr</p>
                <p className="mt-2 max-w-xl text-sm">
                  Dreamr helps you visualize realistic future versions of yourself so you can focus your effort on the life you actually want.
                </p>
                <p className="mt-4 text-xs text-[#B89B7A]">© Dreamr</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/about" className="transition hover:text-[#3D3225]">
                  About
                </Link>
                <Link href="/privacy" className="transition hover:text-[#3D3225]">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="transition hover:text-[#3D3225]">
                  Terms
                </Link>
                <Link href="/contact" className="transition hover:text-[#3D3225]">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
