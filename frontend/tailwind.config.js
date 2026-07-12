/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg-color)",
        panel: "var(--panel-color)",
        accent: "var(--accent-color)",
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
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
