/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    backgroundColor: theme => ({
      'primary' : '#00bd7e',
      'secoundary' : '#212121',
      'third' : ' 	#0b0b0b'
    }),
    borderColor: theme => ({
      'primary': '#00bd7e',
      'secondary': '#212121',
      'third': '#0b0b0b',
     }),
    extend: {},
  },
  plugins: [],
}

