import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      red: "#E60023",
      black: "#111111",
      white: "#FFFFFF",
      transparent: "transparent", // 4.16 9.10  4.54
    },
    extend: {
      colors: {
        "red-dark": "#AD081B",
        "gray-bg": {
          1: "#EFEFEF",
          2: "#F0F0F0",
          3: "#F5F5F5",
          4: "#E9E9E9", // also as most buttons hover bg
        },
        "gray-font": {
          1: "#333365",
          2: "#878787",
          3: "#5F5F5F",
        },
        "gray-tp": {
          "1": "rgba(0,0,0,0.3)",
          "2": "rgba(255, 255, 255, 0.9)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        shrink: "shrink 0.5s ease-in-out",
      },
      keyframes: {
        shrink: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.7)" },
        },
      },
      screens: {
        w1: "540px",
        w2: "768px",
        w3: "820px",
        w4: "912px",
        w5: "1700px",
      },
    },
  },
  plugins: [],
}
export default config
