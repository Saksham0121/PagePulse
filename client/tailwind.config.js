/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eef9ff",
          100: "#d8f1ff",
          200: "#b9e8ff",
          300: "#88dbff",
          400: "#50c5ff",
          500: "#28a8ff",
          600: "#0e8aff",
          700: "#0a72eb",
          800: "#0f5bbf",
          900: "#134f96",
          950: "#0f3163",
        },
        surface: {
          900: "#080c14",
          800: "#0d1220",
          700: "#131929",
          600: "#1a2235",
          500: "#202b40",
          400: "#2a3750",
        },
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer:      "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
