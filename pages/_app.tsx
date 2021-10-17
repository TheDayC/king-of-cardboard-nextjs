import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/system';

import createEmotionCache from '../utils/emotion';
import storeInstance from '../store';
import AuthProvider from '../context/authProvider';
import getDesignTokens from '../theme';
import { PaletteMode } from '../enums/theme';
import ColorModeContext from '../context/context';

// Called outside of the render to only create once.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
    const { store, persistor } = storeInstance();

    const [mode, setMode] = useState<PaletteMode>(PaletteMode.light);
    const colorMode = useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setMode((prevMode: PaletteMode) => (prevMode === 'light' ? PaletteMode.dark : PaletteMode.light));
            },
        }),
        []
    );

    // Update the theme only if the mode changes
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <CacheProvider value={emotionCache}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        <Elements stripe={stripePromise}>
                            <ColorModeContext.Provider value={colorMode}>
                                <ThemeProvider theme={theme}>
                                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                                    <CssBaseline />
                                    <Component {...pageProps} />
                                </ThemeProvider>
                            </ColorModeContext.Provider>
                        </Elements>
                    </AuthProvider>
                </PersistGate>
            </Provider>
        </CacheProvider>
    );
};

export default MyApp;
