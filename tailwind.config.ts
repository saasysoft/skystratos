import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: '#0A0E14',
          surface: '#0C1218',
          border: '#1A2A3C',
          'border-glow': '#0088FF',
          primary: '#0088FF',
          secondary: '#FFB800',
          nominal: '#00FF9F',
          warning: '#FF8C00',
          critical: '#FF3B3B',
          muted: '#2A3A5A',
          'text-primary': '#E0EEFF',
          'text-secondary': '#7BA8D9',
          'text-dim': '#5A7A9B',
        },
        radar: {
          green: '#00FF41',
          trail: 'rgba(0, 255, 65, 0.4)',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', '"Noto Sans TC"', 'sans-serif'],
      },
      fontSize: {
        'hud-xs': ['11px', { letterSpacing: '0.15em', lineHeight: '1.2' }],
        'hud-sm': ['13px', { letterSpacing: '0.1em', lineHeight: '1.3' }],
        'hud-base': ['14px', { letterSpacing: '0.08em', lineHeight: '1.4' }],
        'metric-lg': ['32px', { lineHeight: '1' }],
        'metric-xl': ['48px', { lineHeight: '1' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-fast': 'pulse 0.8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'sweep': 'sweep 3s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 136, 255, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 136, 255, 0.3)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'hud': '0 0 0 1px rgba(0, 136, 255, 0.05), inset 0 1px 0 rgba(0, 136, 255, 0.1), 0 4px 24px rgba(0, 0, 0, 0.6)',
        'hud-glow': '0 0 20px rgba(0, 136, 255, 0.1), 0 0 40px rgba(0, 136, 255, 0.05), inset 0 1px 0 rgba(0, 136, 255, 0.2), 0 4px 24px rgba(0, 0, 0, 0.6)',
        'hud-active': '0 0 30px rgba(0, 136, 255, 0.15), 0 0 60px rgba(0, 136, 255, 0.08), inset 0 1px 0 rgba(0, 136, 255, 0.25), 0 4px 24px rgba(0, 0, 0, 0.6)',
      },
      spacing: {
        'sidebar': '280px',
        'statusbar': '40px',
        'nav': '56px',
      },
    },
  },
  plugins: [],
}
export default config
