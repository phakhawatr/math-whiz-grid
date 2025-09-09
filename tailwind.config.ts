import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				error: {
					DEFAULT: 'hsl(var(--error))',
					foreground: 'hsl(var(--error-foreground))'
				},
				'perfect-square': {
					DEFAULT: 'hsl(var(--perfect-square))',
					foreground: 'hsl(var(--perfect-square-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'table-header': 'hsl(var(--table-header))',
				'table-header-alt': 'hsl(var(--table-header-alt))',
				'table-intersection': 'hsl(var(--table-intersection))',
				'table-cell': 'hsl(var(--table-cell))',
				'table-cell-alt': 'hsl(var(--table-cell-alt))',
				'table-hole': 'hsl(var(--table-hole))',
				'table-row-1': 'hsl(var(--table-row-1))',
				'table-row-2': 'hsl(var(--table-row-2))',
				'table-row-3': 'hsl(var(--table-row-3))',
				'table-row-4': 'hsl(var(--table-row-4))',
				'table-row-5': 'hsl(var(--table-row-5))',
				'table-row-6': 'hsl(var(--table-row-6))',
				'table-row-7': 'hsl(var(--table-row-7))',
				'table-row-8': 'hsl(var(--table-row-8))',
				'table-row-9': 'hsl(var(--table-row-9))',
				'table-row-10': 'hsl(var(--table-row-10))',
				'table-row-11': 'hsl(var(--table-row-11))',
				'table-row-12': 'hsl(var(--table-row-12))',
				'table-row-13': 'hsl(var(--table-row-13))',
				hover: 'hsl(var(--hover))',
				active: 'hsl(var(--active))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
