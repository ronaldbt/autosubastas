/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue", 
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF6B35',
        'brand-blue': '#1E3A8A',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) scale(1)' 
          },
          '33%': { 
            transform: 'translate(30px, -50px) scale(1.1)' 
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.9)' 
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          },
        },
        'bounce-slow': {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-5px)' 
          },
        },
      },
      backdropBlur: {
        '12': '12px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addComponents }) {
      addComponents({
        '.glass-nav': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(12px)',
          'border-bottom': '1px solid rgba(229, 231, 235, 0.2)',
        },
        '.animation-delay-2000': {
          'animation-delay': '2s',
        },
      })
    }
  ],
}