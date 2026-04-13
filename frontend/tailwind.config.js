/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        francia: {
          blue: '#002395',
          gold: '#FFB81C',
        },
        success: '#27AE60',
        error: '#E74C3C',
        dark: {
          bg: '#1A1A1A',
          text: '#FFFFFF',
        },
        light: {
          bg: '#F8F9FA',
          text: '#333333',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
