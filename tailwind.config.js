/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-dark': '#1aa34a',
          black: '#191414',
          'dark-gray': '#121212',
          'medium-gray': '#181818',
          'light-gray': '#282828',
          'lighter-gray': '#b3b3b3',
          white: '#FFFFFF',
        },
      },
      backgroundColor: {
        'spotify-dark': '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
