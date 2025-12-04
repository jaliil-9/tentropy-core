import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-anthracite': '#09090B',
                'carbon-grey': '#121214',
                'hazard-amber': '#FFB000',
                'terminal-green': '#00E090',
                'tungsten-grey': '#27272A',
            },
            fontFamily: {
                mono: ['var(--font-mono)'],
            },
            keyframes: {
                spotlight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translate(-72%, -62%) scale(0.5)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translate(-50%, -40%) scale(1)',
                    },
                },
                'pulse-slow': {
                    '0%, 100%': {
                        opacity: '1',
                    },
                    '50%': {
                        opacity: '.5',
                    },
                },
            },
            animation: {
                spotlight: 'spotlight 2s ease .75s 1 forwards',
                'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
