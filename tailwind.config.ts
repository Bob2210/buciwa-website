import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bcw-green": {
          DEFAULT: "#58CC02",
          dark: "#46A302",
          bright: "#89E219",
          light: "#E5F8D5",
        },
        "bcw-purple": {
          DEFAULT: "#A98BE0",
          dark: "#7C5BC9",
          light: "#F4EEFC",
        },
        "bcw-yellow": "#FFB800",
        "bcw-text": {
          primary: "#1A1F1A",
          secondary: "#5C6360",
        },
        "bcw-border": "#E8EAE7",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "system-ui", "sans-serif"],
        display: ["Nunito", "Inter", "Noto Sans SC", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "14px",
        "3xl": "24px",
      },
      boxShadow: {
        "bcw": "0 4px 0 #46A302",
        "bcw-lg": "0 6px 0 #46A302",
        "bcw-purple": "0 4px 0 #7C5BC9",
        "bcw-black": "0 4px 0 #1A1F1A",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(20px, -10px) rotate(3deg)" },
          "50%": { transform: "translate(-10px, 15px) rotate(-2deg)" },
          "75%": { transform: "translate(15px, 5px) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
}
export default config
