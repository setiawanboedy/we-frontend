module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win-blue': '#0078d4',
        'win-gray': '#f3f2f1',
        'win-border': '#d1d1d1',
        'win-accent': '#005a9e',
        'win-hover': '#106ebe',
        'win-dark': '#323130',
        'win-light': '#faf9f8'
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'win': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'win-lg': '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)'
      },
      borderRadius: {
        'win': '2px'
      }
    },
  },
  plugins: [],
}
