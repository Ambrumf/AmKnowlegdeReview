/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#1a1a2e',
          hover: '#252545',
          active: '#2d2d5a',
        },
        surface: {
          DEFAULT: '#f8f9fb',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
