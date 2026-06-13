import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        charcoal: "#0c0c0c",
        smoke: "#141414",
        mist: "#8a8a8a",
        ivory: "#e8e4df",
        gold: "#c9a962",
        forest: "#7d9b8a",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        logo: "0.21em",
      },
    },
  },
  plugins: [],
};

export default config;
