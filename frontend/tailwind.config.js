/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#141414",
        accent: "#d97706",
        status: {
          available: "#22c55e",
          ontrip: "#3b82f6",
          inshop: "#f59e0b",
          retired: "#ef4444",
          suspended: "#ef4444",
          offduty: "#eab308",
        }
      }
    },
  },
  plugins: [],
}
