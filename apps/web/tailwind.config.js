/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#07111F',
          secondary: '#0E1B2E',
          card: 'rgba(14, 27, 46, 0.7)',
        },
        mint: {
          DEFAULT: '#65F5C6',
          hover: '#38D9A9',
          glow: 'rgba(101, 245, 198, 0.2)',
        },
        darkBorder: 'rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        mintGlow: '0 0 20px rgba(101, 245, 198, 0.25)',
      },
    },
  },
  plugins: [],
}
