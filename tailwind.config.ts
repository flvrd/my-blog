import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // Added lib just in case
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // Optional: helps with rich text if you installed it
  ],
};
export default config;
