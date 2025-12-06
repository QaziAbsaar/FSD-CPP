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
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 10px 30px rgba(0, 0, 0, 0.08)',
        soft: '0 4px 15px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-mint': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-subtle': 'linear-gradient(to bottom right, #FFFFFF, #F0FDF4)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
