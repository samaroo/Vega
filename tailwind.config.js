module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
        dark: 'rgba(50, 50, 93, 0.45) 0px 50px 100px -20px, rgba(0, 0, 0, 0.5) 0px 30px 60px -30px'
      }
    },
    fontFamily: {
      custom: ['Comfortaa', 'sans-serif'],
      'sans': ['Noto Sans', 'sans'],
      logo: ['Julius Sans One', 'sans-serif']
    }
  },
  plugins: [],
}
