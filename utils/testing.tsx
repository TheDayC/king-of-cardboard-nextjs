/* eslint-disable import/export,@typescript-eslint/ban-ts-comment */
import React from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Import your own reducer
import rootReducer from '../store/slices';

function render(
    ui: React.ReactElement,
    {
        // @ts-ignore
        preloadedState,
        store = configureStore({ reducer: rootReducer, preloadedState }),
        ...renderOptions
    } = {}
): RenderResult {
    // @ts-ignore
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
