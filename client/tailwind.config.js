/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float1: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-30px) translateX(15px) rotate(10deg)',
            opacity: '0.5',
          },
        },
        float2: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'translateY(25px) translateX(-20px) rotate(-8deg)',
            opacity: '0.4',
          },
        },
        float3: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: '0.1',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(25px) rotate(5deg)',
            opacity: '0.25',
          },
        },
      },
      animation: {
        'float-1': 'float1 15s ease-in-out infinite',
        'float-2': 'float2 20s ease-in-out infinite',
        'float-3': 'float3 25s ease-in-out infinite',
      },
      perspective: { 
        '1000': '1000px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) { 
      const newUtilities = {
        '.perspective': {
          perspective: '1000px', // Or use theme('perspective.1000') if defined above
        },
      }
      addUtilities(newUtilities)
    },],
};
