/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fitorange: '#FF7A00',
        teal: {
          DEFAULT: '#009379',
          hover: '#007a64',
        },
        accent: {
          DEFAULT: '#FE895C',
          hover: '#f5703d',
        },
        resulttint: '#f0faf8',
      },
      fontFamily: {
        system: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      screens: {
        'min-420': '420px',
      },
    },
  },
  plugins: [],
}
