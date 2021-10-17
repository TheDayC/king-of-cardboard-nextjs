import { PaletteMode } from '../enums/theme';

const lightTheme = {
    mode: 'light',
    primary: {
        main: '#676767',
    },
    secondary: {
        main: '#f6c467',
    },
    error: {
        main: '#ff5724',
    },
    warning: {
        main: '#ff9900',
    },
    info: {
        main: '#2094f3',
    },
};

const darkTheme = {
    type: 'dark',
    primary: {
        main: '#676767',
    },
    secondary: {
        main: '#f6c467',
    },
    error: {
        main: '#ff5724',
    },
    warning: {
        main: '#ff9900',
    },
    info: {
        main: '#2094f3',
    },
};

const getDesignTokens = (mode: PaletteMode): any => {
    const theme = mode === PaletteMode.light ? lightTheme : darkTheme;
    return {
        palette: {
            mode,
            ...theme,
        },
    };
};

export default getDesignTokens;
