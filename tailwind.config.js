/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Antigravity Palette
                void: '#030712', // Deepest black/blue
                starlight: '#f8fafc', // Pure white text
                nebula: {
                    500: '#6366f1', // Indigo
                    400: '#818cf8',
                },
                aurora: {
                    500: '#2dd4bf', // Teal/Cyan
                    400: '#5eead4',
                },
                plasma: {
                    500: '#c084fc', // Purple
                    400: '#d8b4fe',
                },
                surface: {
                    light: 'rgba(255, 255, 255, 0.03)',
                    medium: 'rgba(255, 255, 255, 0.07)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // For technical/HUD elements
            },
            backgroundImage: {
                'void-gradient': 'radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%)',
                'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
