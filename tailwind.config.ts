import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Enables dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background, 0, 0%, 100%))", // ✅ Fix for `bg-background`
        foreground: "hsl(var(--foreground, 0, 0%, 0%))", // ✅ Ensures text color works
        border: "hsl(var(--border, 220, 13%, 91%))", // ✅ Ensures `border-border` works
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // ✅ Animation Plugin
    require("@tailwindcss/typography"), // ✅ Typography Plugin for Markdown styling
  ],
} satisfies Config;
