/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9CFFC2',
        'light-1': '#F4F4F4',
        'light-2': '#F9F9F9',
        'light-3': '#F2F2F2',
        'light-4': '#EDEDED',
        'light-5': '#E2E2E2',
        'dark-1': '#010101',
        'dark-2': '#1E1E1C',
        'accent-bg': '#E2F0F0',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
