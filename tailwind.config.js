/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spaceBg: "#07131E",
        spaceBgSec: "#0B1F2F",
        accentCyan: "#00E5FF",
        accentBlue: "#4D9FFF",
        forecastYellow: "#FFD54F",
        dangerRed: "#FF4D6D",
        successGreen: "#00E676",
        warningAmber: "#FFB300",
        textPri: "#F8FAFC",
        textSec: "#B6C2CF",
        textMuted: "#7B8794",
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        cyanGlow: '0 10px 40px rgba(0, 229, 255, 0.15)',
        neonGlow: '0 0 15px rgba(0, 229, 255, 0.25)',
        dangerGlow: '0 0 20px rgba(255, 77, 109, 0.4)',
      }
    },
  },
  plugins: [],
}
