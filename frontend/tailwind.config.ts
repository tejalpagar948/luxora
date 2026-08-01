import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#121212',
        secondary: '#F5F5F0',
        accent: '#D4AF37',
        'accent-light': '#E5D1B0',
        background: '#FFFFFF',
        'background-alt': '#FBF9F9',
        'border-muted': '#747878',
        'border-light': '#E0E0E0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Montserrat"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em' }],
        'display-lg-mobile': ['40px', { lineHeight: '48px', letterSpacing: '-0.01em' }],
        'headline-md': ['32px', { lineHeight: '40px' }],
        'headline-sm': ['24px', { lineHeight: '32px' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0.01em' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.15em' }],
        'button': ['14px', { lineHeight: '20px', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        md: '8px',
        lg: '16px',
      },
      aspectRatio: {
        product: '4/5',
      },
      spacing: {
        'container-max': '1440px',
        'margin-desktop': '80px',
        'margin-mobile': '20px',
        'section-desktop': '120px',
        'section-mobile': '64px',
      }
    },
  },
  plugins: [],
} satisfies Config
