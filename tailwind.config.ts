import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          dark:  "#002d14",
          mid:   "#004d24",
          main:  "#006633",
          light: "#2d8a52",
          muted: "#a8d5b5",
          pale:  "#eaf4ee",
        },
        gold: {
          DEFAULT: "#C9A84C",
          dark:    "#3D2A00",
          light:   "#f0d88a",
        },
        wa: "#25D366",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        sans:   ["Source Sans 3", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
