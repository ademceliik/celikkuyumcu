
import type { Config } from "tailwindcss";
import animate from "tw-animate-css";
import typography from "@tailwindcss/typography";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Config = {
  darkMode: ["class"],
  content: [
    path.resolve(__dirname, "src/**/*.{ts,tsx,js,jsx}"),
    path.resolve(__dirname, "../shared/**/*.{ts,tsx}"),
  ],
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
        border: "hsl(45, 15%, 85%)",
        input: "hsl(45, 20%, 95%)",
        ring: "hsl(45, 80%, 55%)",
        background: "hsl(45, 25%, 98%)",
        foreground: "hsl(220, 15%, 15%)",
        primary: {
          DEFAULT: "hsl(45, 80%, 55%)",
          foreground: "hsl(45, 20%, 15%)",
        },
        secondary: {
          DEFAULT: "hsl(220, 25%, 25%)",
          foreground: "hsl(45, 25%, 95%)",
        },
        destructive: {
          DEFAULT: "hsl(356.3033, 90.5579%, 54.3137%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(45, 15%, 92%)",
          foreground: "hsl(220, 10%, 45%)",
        },
        accent: {
          DEFAULT: "hsl(15, 45%, 75%)",
          foreground: "hsl(220, 15%, 15%)",
        },
        popover: {
          DEFAULT: "hsl(45, 25%, 98%)",
          foreground: "hsl(220, 15%, 15%)",
        },
        card: {
          DEFAULT: "hsl(45, 20%, 96%)",
          foreground: "hsl(220, 15%, 20%)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
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
    },
  },
  plugins: [animate, typography],
};

export default config;

