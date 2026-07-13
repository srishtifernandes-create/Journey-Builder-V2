/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: {
          50: '#d5e95ab1', // transparent primary background tint placeholder or standard token mapped below
          500: '#1766D6',
          600: '#0f52b8',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F9FAFB',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          900: '#131A25',
        },
      },
    },
  },
  plugins: [],
}
