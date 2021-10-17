import React from 'react';

interface ColorModeProps {
    toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeProps | null>(null);

export default ColorModeContext;
