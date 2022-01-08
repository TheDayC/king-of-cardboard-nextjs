/* eslint-disable import/export,@typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import storage from 'redux-persist/lib/storage';
import { SessionProvider } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Import your own reducer
import rootReducer from '../../store/slices';
import OrderAndTokenProvider from '../../context/OrderAndTokenProvider';
import PageProvider from '../../context/PageProvider';
import Drawer from '../../components/Drawer';
import globalInitialState from '../../store/state/global';
import productsInitialState from '../../store/state/products';
import cartInitialState from '../../store/state/cart';
import alertsInitialState from '../../store/state/alerts';
import filtersInitialState from '../../store/state/filters';
import checkoutInitialState from '../../store/state/checkout';
import confirmationInitialState from '../../store/state/confirmation';
import shopInitialState from '../../store/state/shop';
import breaksInitialState from '../../store/state/breaks';
import accountInitialState from '../../store/state/account';
import pagesInitialState from './initialStates/page';

const mockSession = {
    expires: '3022-02-07T11:03:03.719Z',
    user: {
        email: 'dayc@kingofcardboard.co.uk',
    },
};
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const defaultState = {
    global: globalInitialState,
    products: productsInitialState,
    cart: cartInitialState,
    alerts: alertsInitialState,
    filters: filtersInitialState,
    checkout: checkoutInitialState,
    confirmation: confirmationInitialState,
    pages: pagesInitialState,
    shop: shopInitialState,
    breaks: breaksInitialState,
    account: accountInitialState,
};

function render(
    ui: any,
    {
        // @ts-ignore
        preloadedState = defaultState,
        store = configureStore({ reducer: rootReducer, preloadedState }),
        ...renderOptions
    } = {}
) {
    // @ts-ignore
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <SessionProvider session={mockSession}>
                    <OrderAndTokenProvider>
                        <PageProvider>
                            <Elements stripe={stripePromise}>
                                <Drawer>{children}</Drawer>
                            </Elements>
                        </PageProvider>
                    </OrderAndTokenProvider>
                </SessionProvider>
            </Provider>
        );
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
