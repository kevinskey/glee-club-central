
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class", '[data-theme="dark"]'],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
			},
			screens: {
				'sm': '640px',
				'md': '768px', 
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				playfair: ['Playfair Display', 'serif'],
				inter: ['Inter', 'sans-serif'],
			},
			fontSize: {
				// Fluid typography scale using clamp
				'fluid-h1': 'clamp(1.75rem, 5vw, 3rem)',
				'fluid-h2': 'clamp(1.5rem, 4.2vw, 2.5rem)',
				'fluid-h3': 'clamp(1.25rem, 3.8vw, 2rem)',
				'fluid-p': 'clamp(0.875rem, 3.5vw, 1.125rem)',
				'fluid-btn': 'clamp(0.875rem, 4vw, 1rem)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for glee theme
				glee: {
					purple: '#4B9CD3', // Carolina Blue
					gold: '#FFFFFF',    // White
					light: '#F5FAFF',   // Very light blue background
					dark: '#212529',    // Black for accents
					accent: '#333333',  // Changed from blue to dark gray
					spelman: '#0B3C84', // Spelman Blue - preserved for specific uses
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			letterSpacing: {
				tightest: '-.075em',
				tighter: '-.05em',
				tight: '-.025em',
				normal: '0',
				wide: '.025em',
				wider: '.05em',
				widest: '.1em',
				spaced: '.2em',
			},
			spacing: {
				// Responsive spacing scale
				'mobile-section': '1.5rem',
				'tablet-section': '2.5rem',
				'desktop-section': '4rem',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
