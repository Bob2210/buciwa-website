import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        "bcw-green": "#58CC02",
        "bcw-green-deep": "#46A302",
        "bcw-green-soft": "#E5F8D5",
        "bcw-purple": "#A98BE0",
        "bcw-purple-deep": "#7C5BC9",
        "bcw-purple-soft": "#F4EEFC",
        "bcw-yellow": "#FFB800",
        "bcw-cream": "#FFFFFF",
        "bcw-ink": "#1A1F1A",
        "bcw-ink-soft": "#5C6360",
        "bcw-line": "#E8EAE7",
      },
      borderRadius: {
        btn: "14px",
        card: "24px",
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', "Inter", "system-ui", "sans-serif"],
        num: ["Inter", '"Noto Sans SC"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
