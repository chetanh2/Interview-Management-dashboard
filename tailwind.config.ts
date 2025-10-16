import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // colors: {
      //   lamaSky: "#C3EBFA",
      //   lamaSkyLight: "#EDF9FD",
      //   lamaPurple: "#CFCEFF",
      //   lamaPurpleLight: "#F1F0FF",
      //   lamaYellow: "#FAE27C",
      //   lamaYellowLight: "#FEFCE8",
      // },
      colors: {
        brand: {
          green: "#16A34A",     // ✅ success, highlights
          lavender: "#C7C4F5",  // ✅ KPI card background
          yellow: "#FAE27C",    // ✅ charts, warning
          sky: "#C3EBFA",       // ✅ secondary chart data
          purple: "#8B5CF6",    // ✅ accents, CTAs
          gray: "#4B5563",      // ✅ text
          background: "#F3F4F6" // ✅ page background
        }
      }
    },
  },
  plugins: [],
};
export default config;
