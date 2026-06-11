/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ouro: {
          300: '#FFE066',
          400: '#FFD700',
          500: '#FFA500',
          600: '#FF8C00',
          700: '#E07800',
        },
        vermelho: {
          400: '#FF4444',
          500: '#DC143C',
          600: '#B01030',
          700: '#8B0020',
        },
        madeira: {
          400: '#C47B3A',
          500: '#A0522D',
          600: '#8B4513',
          700: '#6B3410',
        },
        creme: {
          50:  '#FFFDF0',
          100: '#FFF8DC',
          200: '#FFF0A0',
        },
        escuro: {
          900: '#0A0500',
          800: '#150A00',
          700: '#1E1000',
          600: '#2A1500',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'Arial Black', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'coin-float': 'coinFloat 3s ease-in-out infinite',
        'coin-float-2': 'coinFloat 3.5s ease-in-out infinite 0.5s',
        'coin-float-3': 'coinFloat 4s ease-in-out infinite 1s',
        'coin-float-4': 'coinFloat 2.8s ease-in-out infinite 1.5s',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ray-spin': 'raySpin 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        coinFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.9' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #FFD700, 0 0 40px #FFA500' },
          '50%': { boxShadow: '0 0 40px #FFD700, 0 0 80px #FFA500, 0 0 100px #FF8C00' },
        },
        raySpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        'red-gradient': 'linear-gradient(135deg, #DC143C 0%, #FF0000 50%, #DC143C 100%)',
        'dark-gold': 'radial-gradient(ellipse at center, #2A1500 0%, #0A0500 70%)',
        'hero-bg': 'radial-gradient(ellipse at top, #3D1A00 0%, #0A0500 60%)',
        'card-bg': 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)',
        'shimmer-gold': 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(255,215,0,0.5), 0 4px 15px rgba(255,165,0,0.3)',
        'gold-lg': '0 0 40px rgba(255,215,0,0.6), 0 8px 30px rgba(255,165,0,0.4)',
        'red': '0 0 20px rgba(220,20,60,0.5), 0 4px 15px rgba(220,20,60,0.3)',
        'red-lg': '0 0 40px rgba(220,20,60,0.6), 0 8px 30px rgba(220,20,60,0.4)',
        'inset-gold': 'inset 0 2px 4px rgba(255,215,0,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(255,215,0,0.1)',
      },
    },
  },
  plugins: [],
};
