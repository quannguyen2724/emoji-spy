/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      colors: {
        'game-bg': '#f0f9ff',
        'game-primary': '#0ea5e9',
        'game-secondary': '#64748b',
        'game-accent': '#f59e0b',
        'game-success': '#10b981',
        'game-error': '#ef4444',
        'game-text': '#1e293b',
      },
      boxShadow: {
        'game-tile': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'game-tile-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} 