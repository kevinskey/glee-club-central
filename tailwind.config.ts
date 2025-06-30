
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.5rem",
        sm: "1rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['"Inter"', 'sans-serif'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        // Updated unified text scale with larger default paragraph size
        'h1': ['clamp(1.875rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3': ['clamp(1.25rem, 2.5vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h4': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h5': ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h6': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.003em', fontWeight: '600' }],
        'body': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.003em', fontWeight: '400' }],
        'body-large': ['1.25rem', { lineHeight: '1.55', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-small': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.002em', fontWeight: '400' }],
        'label': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.002em', fontWeight: '500' }],
        'small': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '400' }],
        'button': ['1rem', { lineHeight: '1.2', letterSpacing: '-0.002em', fontWeight: '500' }],
        'button-large': ['1.125rem', { lineHeight: '1.2', letterSpacing: '-0.003em', fontWeight: '500' }],
        'button-small': ['0.875rem', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Glee Club Brand Colors
        'glee-blue': '#0072CE',
        'glee-white': '#FFFFFF',
        'glee-black': '#333333',
        'glee-gray': '#888888',
        // Legacy aliases for compatibility
        'glee-spelman': '#0072CE',
        'glee-columbia': '#0072CE',
        'columbia-blue': '#0072CE',
        // Light color palette for softer look
        'light': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Navy color palette
        'navy': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'blue': {
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0072CE",
          600: "#0369a1",
          700: "#0c4a6e",
          800: "#075985",
          900: "#0c4a6e",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
