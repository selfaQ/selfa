/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#f4f9f6',
        bg2:   '#eaf3ee',
        bg3:   '#ddeee6',
        card:  '#ffffff',
        card2: '#f0f7f3',
        mint:  '#0ea572',
        jade:  '#0d8a52',
        jade2: '#096b41',
        gold:  '#d4920a',
        gold2: '#b07a08',
        red:   '#e03535',
        t1:    '#0d1f17',
        t2:    '#2e5c43',
        t3:    '#6b9b80',
        navy:    '#0f172a',
        primary: '#4f46e5',
        brand:   '#4f46e5',
      },
      borderRadius: {
        card: '1rem',
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
        bebas:  ['"Bebas Neue"', 'sans-serif'],
        mono:   ['"Courier New"', 'monospace'],
      },
      boxShadow: {
        mint: '0 2px 12px rgba(14,165,114,0.18)',
        jade: '0 2px 12px rgba(13,138,82,0.18)',
        gold: '0 2px 12px rgba(212,146,10,0.18)',
        glow: '0 2px 16px rgba(14,165,114,0.08)',
      },
    },
  },
  plugins: [],
}
