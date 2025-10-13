/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon colors
        'neon-pink': '#ff0080',
        'neon-blue': '#00ffff',
        'neon-green': '#00ff00',
        'neon-purple': '#8000ff',
        'neon-orange': '#ff4500',
        'neon-yellow': '#ffff00',
        // Dark backgrounds
        'dark-bg': '#0a0a0a',
        'dark-darker': '#050505',
        'dark-card': '#1a1a1a',
        'dark-card-hover': '#2a2a2a',
        // Text colors
        'text-secondary': '#cccccc',
        'text-muted': '#888888',
      },
      boxShadow: {
        // Generic neon shadows
        'neon-sm': '0 0 5px currentColor',
        'neon-md': '0 0 10px currentColor',
        'neon-lg': '0 0 20px currentColor',
        'neon-xl': '0 0 40px currentColor',
        // Pink neon shadows
        'neon-pink-sm': '0 0 5px #ff0080',
        'neon-pink-md': '0 0 10px #ff0080',
        'neon-pink-lg': '0 0 20px #ff0080',
        'neon-pink-xl': '0 0 40px #ff0080',
        // Blue neon shadows
        'neon-blue-sm': '0 0 5px #00ffff',
        'neon-blue-md': '0 0 10px #00ffff',
        'neon-blue-lg': '0 0 20px #00ffff',
        'neon-blue-xl': '0 0 40px #00ffff',
        // Purple neon shadows
        'neon-purple-sm': '0 0 5px #8000ff',
        'neon-purple-md': '0 0 10px #8000ff',
        'neon-purple-lg': '0 0 20px #8000ff',
        'neon-purple-xl': '0 0 40px #8000ff',
        // Green neon shadows
        'neon-green-sm': '0 0 5px #00ff00',
        'neon-green-md': '0 0 10px #00ff00',
        'neon-green-lg': '0 0 20px #00ff00',
        'neon-green-xl': '0 0 40px #00ff00',
      },
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'neon': ['Orbitron', 'monospace'],
      },
      screens: {
        'mobile': '768px',
        'tablet': '1024px',
        'desktop': '1200px',
        'large-desktop': '1400px',
      },
      spacing: {
        'xs': '0.125rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'neon-flicker': 'neonFlicker 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': {
            boxShadow: '0 0 10px currentColor',
          },
          '50%': {
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        neonFlicker: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-60px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(60px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideUp: {
          from: {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
