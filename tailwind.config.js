/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#002E59',
          50: '#E6EEF5',
          100: '#CCE0EB',
          200: '#99C1D7',
          300: '#66A2C3',
          400: '#3383AF',
          500: '#004686',
          600: '#002E59',
          700: '#001F3F',
          800: '#001529',
          900: '#000A14',
        },
        cream: {
          DEFAULT: '#f8f6f3',
          50: '#fdfcfb',
          100: '#f8f6f3',
          200: '#f0ebe5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.1)',
        'navy': '0 4px 12px rgba(0, 46, 89, 0.25)',
      },
    },
  },
  plugins: [],
}
