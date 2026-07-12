/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--bg-color'),
        panel: withOpacity('--panel-color'),
        accent: withOpacity('--accent-color'),
        gray: {
          50: withOpacity('--gray-50'),
          100: withOpacity('--gray-100'),
          200: withOpacity('--gray-200'),
          300: withOpacity('--gray-300'),
          400: withOpacity('--gray-400'),
          500: withOpacity('--gray-500'),
          600: withOpacity('--gray-600'),
          700: withOpacity('--gray-700'),
          800: withOpacity('--gray-800'),
          900: withOpacity('--gray-900'),
          950: withOpacity('--gray-950'),
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
