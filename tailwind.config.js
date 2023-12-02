/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    purge: false,
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.5)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
            },
            lineHeight: {
                'after-content': '0.4',
            },
        },
        backgroundColor: (theme) => ({
            ...theme('colors'),
            twitch: '#9146FF',
            'twitch-dark': '#772CE8',
        }),
    },
    variants: {
        extend: {
            filter: ['hover'],
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                king: {
                    primary: '#f6c467',
                    'primary-focus': '#c59d52',
                    'primary-content': '#ffffff',
                    secondary: '#119fda',
                    'secondary-focus': '#0c77a3',
                    'secondary-content': '#ffffff',
                    accent: '#C365F6',
                    'accent-focus': '#8947ac',
                    'accent-content': '#ffffff',
                    neutral: '#676767',
                    'neutral-focus': '#4d4d4d',
                    'neutral-content': '#ffffff',
                    'base-100': '#ffffff',
                    'base-200': '#cccccc',
                    'base-300': '#4c4c4c',
                    'base-content': '#4d4d4d',
                    info: '#2094f3',
                    success: '#009485',
                    warning: '#ff9900',
                    error: '#ff5724',
                    '.menu-link:hover': {
                        'background-color': '#525252',
                    },
                    '.menu-link:focus': {
                        color: '#ffffff',
                    },
                },
            },
        ],
    },
};
