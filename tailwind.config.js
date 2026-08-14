/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#12101A',
          panel: '#1B1826',
          panel2: '#241F33',
          gold: '#E8B923',
          goldDim: '#8A6A16',
          line: '#332C48'
        },
        game: {
          red: '#E63946',
          blue: '#3A86FF',
          green: '#2ECC71',
          yellow: '#F4D35E',
          white: '#F1EFEA',
          pink: '#FF5DA2'
        }
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        glow: '0 0 25px 4px var(--glow-color, rgba(232,185,35,0.55))'
      },
      keyframes: {
        marquee: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 0' }
        },
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.35)' }
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: 0 },
          '70%': { transform: 'scale(1.08)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      },
      animation: {
        marquee: 'marquee 1.2s linear infinite',
        pulseGlow: 'pulseGlow 1.6s ease-in-out infinite',
        popIn: 'popIn 0.5s cubic-bezier(.2,.9,.3,1.3)'
      }
    }
  },
  plugins: []
}
