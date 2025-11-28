import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Dreamr theme colors
        dreamr: {
          // Primary gold colors (for buttons, accents)
          gold: {
            DEFAULT: "#D4A574",
            dark: "#C4956A",
            light: "#E5C4A8",
          },
          // Text colors
          text: {
            dark: "#3D3225",      // Primary headings
            DEFAULT: "#7A6B5A",   // Body text
            light: "#9A8B7A",     // Subtle text
            accent: "#B89B7A",    // Accent text, labels
          },
          // Background colors (cream gradient)
          bg: {
            cream: "#FDF8F3",
            warm: "#FEF3E8",
            peach: "#FDF0E6",
            card: "rgba(255, 255, 255, 0.7)",
          },
          // Border colors
          border: {
            DEFAULT: "#E7D6C5",
            light: "#F0E2D3",
            subtle: "#E8D5C4",
            muted: "#D9C3AE",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      // Common box shadows used across the app
      boxShadow: {
        'dreamr-sm': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'dreamr': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'dreamr-lg': '0 20px 60px rgba(212, 165, 116, 0.15)',
        'dreamr-gold': '0 8px 30px rgba(212, 165, 116, 0.4)',
        'dreamr-gold-lg': '0 12px 40px rgba(212, 165, 116, 0.5)',
        'dreamr-card': '0 25px 70px rgba(212, 165, 116, 0.18)',
      },
      // Background gradients
      backgroundImage: {
        'dreamr-gradient': 'linear-gradient(to bottom right, #FDF8F3, #FEF3E8, #FDF0E6)',
        'dreamr-button': 'linear-gradient(to bottom right, #D4A574, #C4956A)',
        'dreamr-button-r': 'linear-gradient(to right, #D4A574, #C4956A)',
        'dreamr-glow-1': 'radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, transparent 70%)',
        'dreamr-glow-2': 'radial-gradient(circle, rgba(196, 149, 106, 0.2) 0%, transparent 70%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
