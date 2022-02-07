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
        },
        backgroundColor: (theme) => ({
            ...theme('colors'),
            twitch: '#9146FF',
            'twitch-dark': '#772CE8',
        }),
        cursor: {
            crosshair: 'crosshair',
        },
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
                    secondary: '#60c7f2',
                    'secondary-focus': '#438ba9',
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
                },
            },
        ],
    },
};
