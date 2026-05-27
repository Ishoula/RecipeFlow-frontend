import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4CAF50',
                secondary: '#FF7043',
                dark: '#2D2D2D',
                light: '#FFF8F0',
                surface: '#FFFFFF',
            },
        },
    },
    plugins: [],
}
export default config
