/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f3',
          100: '#ffeadc',
          200: '#ffd4b8',
          300: '#ffb98a',
          400: '#f6a064',
          500: '#e58a48',
          600: '#c97235',
          700: '#9f572d',
          800: '#7c4528',
          900: '#633923',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans TC"', '"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
