/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'rgb(var(--mat-sys-primary) / <alpha-value>)',
					container: 'rgb(var(--mat-sys-primary-container) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-primary) / <alpha-value>)',
					'on-container': 'rgb(var(--mat-sys-on-primary-container) / <alpha-value>)',
					inverse: 'rgb(var(--mat-sys-inverse-primary) / <alpha-value>)',
					fixed: 'rgb(var(--mat-sys-primary-fixed) / <alpha-value>)',
					'fixed-dim': 'rgb(var(--mat-sys-primary-fixed-dim) / <alpha-value>)',
					'on-fixed': 'rgb(var(--mat-sys-on-primary-fixed) / <alpha-value>)',
					'on-fixed-variant': 'rgb(var(--mat-sys-on-primary-fixed-variant) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: 'rgb(var(--mat-sys-secondary) / <alpha-value>)',
					container: 'rgb(var(--mat-sys-secondary-container) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-secondary) / <alpha-value>)',
					'on-container': 'rgb(var(--mat-sys-on-secondary-container) / <alpha-value>)',
					fixed: 'rgb(var(--mat-sys-secondary-fixed) / <alpha-value>)',
					'fixed-dim': 'rgb(var(--mat-sys-secondary-fixed-dim) / <alpha-value>)',
					'on-fixed': 'rgb(var(--mat-sys-on-secondary-fixed) / <alpha-value>)',
					'on-fixed-variant': 'rgb(var(--mat-sys-on-secondary-fixed-variant) / <alpha-value>)',
				},
				tertiary: {
					DEFAULT: 'rgb(var(--mat-sys-tertiary) / <alpha-value>)',
					container: 'rgb(var(--mat-sys-tertiary-container) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-tertiary) / <alpha-value>)',
					'on-container': 'rgb(var(--mat-sys-on-tertiary-container) / <alpha-value>)',
					fixed: 'rgb(var(--mat-sys-tertiary-fixed) / <alpha-value>)',
					'fixed-dim': 'rgb(var(--mat-sys-tertiary-fixed-dim) / <alpha-value>)',
					'on-fixed': 'rgb(var(--mat-sys-on-tertiary-fixed) / <alpha-value>)',
					'on-fixed-variant': 'rgb(var(--mat-sys-on-tertiary-fixed-variant) / <alpha-value>)',
				},
				surface: {
					DEFAULT: 'rgb(var(--mat-sys-surface) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-surface) / <alpha-value>)',
					dim: 'rgb(var(--mat-sys-surface-dim) / <alpha-value>)',
					bright: 'rgb(var(--mat-sys-surface-bright) / <alpha-value>)',
					container: {
						DEFAULT: 'rgb(var(--mat-sys-surface-container) / <alpha-value>)',
						lowest: 'rgb(var(--mat-sys-surface-container-lowest) / <alpha-value>)',
						high: 'rgb(var(--mat-sys-surface-container-high) / <alpha-value>)',
						highest: 'rgb(var(--mat-sys-surface-container-highest) / <alpha-value>)',
					},
					tint: 'rgb(var(--mat-sys-surface-tint) / <alpha-value>)',
					variant: 'rgb(var(--mat-sys-surface-variant) / <alpha-value>)',
					'on-variant': 'rgb(var(--mat-sys-on-surface-variant) / <alpha-value>)',
				},
				error: {
					DEFAULT: 'rgb(var(--mat-sys-error) / <alpha-value>)',
					container: 'rgb(var(--mat-sys-error-container) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-error) / <alpha-value>)',
					'on-container': 'rgb(var(--mat-sys-on-error-container) / <alpha-value>)',
				},
				background: {
					DEFAULT: 'rgb(var(--mat-sys-background) / <alpha-value>)',
					on: 'rgb(var(--mat-sys-on-background) / <alpha-value>)',
				},
			},
		},
	},
	plugins: [],
}
