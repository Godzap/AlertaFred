export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50:  '#eef4fb',
                    100: '#dce9f5',
                    200: '#b8d4f0',
                    300: '#7eb0e6',
                    400: '#4a8ad4',
                    500: '#2563b0',
                    600: '#1a5192',
                    700: '#163d6e',
                    800: '#102a4e',
                    900: '#0c1d3a',
                },
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                body: ['"DM Sans"', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 2px rgba(12, 29, 58, 0.04)',
                'card-md': '0 4px 12px rgba(12, 29, 58, 0.06)',
                'card-lg': '0 8px 24px rgba(12, 29, 58, 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-out',
                'slide-in-right': 'slideInRight 300ms ease-out',
                'scale-in': 'scaleIn 200ms ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideInRight: { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
                scaleIn: { from: { transform: 'scale(0.96)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
                pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
            },
        },
    },
    plugins: [],
}
