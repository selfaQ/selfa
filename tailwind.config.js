/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#0a0f0d',
        bg2:   '#111a15',
        bg3:   '#162019',
        card:  '#1a2820',
        card2: '#1f3028',
        mint:  '#3fffa2',
        jade:  '#1db874',
        jade2: '#0d8a52',
        gold:  '#f5c842',
        gold2: '#d4a017',
        red:   '#ff5a5a',
        t1:    '#e8fff5',
        t2:    '#8ab8a0',
        t3:    '#4a7a60',
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
        bebas:  ['"Bebas Neue"', 'sans-serif'],
        mono:   ['"Courier New"', 'monospace'],
      },
      boxShadow: {
        mint: '0 0 14px rgba(63,255,162,0.25)',
        jade: '0 0 14px rgba(29,184,116,0.30)',
        gold: '0 0 14px rgba(245,200,66,0.25)',
        glow: '0 0 20px rgba(63,255,162,0.06)',
      },
    },
  },
  plugins: [],
}
