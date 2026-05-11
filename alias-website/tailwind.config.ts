import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#06080a",
          50: "#0a0d0e",
          100: "#0e1114",
        },
        cyan: {
          accent: "#7FE3E6",
          deep: "#5BC8CC",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "'Cormorant Garamond'", "serif"],
        sans: ["'Inter Tight'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
} satisfies Config;
