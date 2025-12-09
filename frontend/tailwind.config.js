import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-light': '#34D399',
        secondary: '#FB7185',
        'secondary-dark': '#F43F5E',
        'text-dark': '#0F172A',
        'text-gray': '#4B5563',
        glass: 'rgba(255, 255, 255, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
        'dark-bg': '#020617',
        'neon-blue': '#3b82f6',
        'neon-purple': '#8b5cf6',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 10px 30px rgba(0, 0, 0, 0.08)',
        soft: '0 4px 15px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-mint': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-subtle': 'linear-gradient(to bottom right, #FFFFFF, #F0FDF4)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'gradient-cosmic': 'linear-gradient(to right bottom, #2d1b69, #1a103c, #000000)',
        'gradient-radial-glow': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, rgba(15, 23, 42, 0) 70%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
