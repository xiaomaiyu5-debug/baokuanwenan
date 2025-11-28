export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        brand: '#406EFF',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
      boxShadow: {
        'float': '0 8px 30px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}