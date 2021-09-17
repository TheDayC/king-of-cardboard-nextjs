module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
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
                    'base-200': '#f9fafb',
                    'base-300': '#d1d5db',
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
