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
        // Core Society — palette officielle (CLAUDE.md section 2)
        blue: {
          DEFAULT: "#1C42BD", // Blue principal
          light: "#EFF4FF", // Blue bg light
          mid: "#C5D2F7", // Blue mid (bars)
        },
        ink: "#1A1A1A", // Noir texte
        page: "#f0f0ec", // Fond page — Piste A
        card: "#FFFFFF", // Fond blanc
        border: {
          DEFAULT: "#E8E8E4", // Border
          strong: "#E0E0DC", // Border fort
        },
        muted: {
          DEFAULT: "#888888", // Texte muted
          light: "#BBBBBB", // Texte muted light
        },
        success: "#16A34A", // Vert succès
        warning: "#D97706", // Amber warning
        urgent: "#DC2626", // Rouge urgent
      },
      fontFamily: {
        // Police unique du projet : Poppins (aucune autre, zéro Space Mono)
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px", // cartes
        agent: "6px", // agents
        badge: "4px", // badges
      },
    },
  },
  plugins: [],
};
export default config;
