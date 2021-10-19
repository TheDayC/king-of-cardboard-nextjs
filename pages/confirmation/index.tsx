import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import { setCheckoutLoading } from '../../store/slices/global';
import { resetCart, setOrder } from '../../store/slices/cart';
import { resetCheckoutDetails } from '../../store/slices/checkout';
import selector from './selector';
import { createOrder } from '../../utils/commerce';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { confirmationOrder, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const router = useRouter();

    // Create a brand new order and set the id in the store.
    const generateOrder = useCallback(
        async (accessToken: string) => {
            const order = await createOrder(accessToken);

            if (order) {
                // Add the order to the store.
                dispatch(setOrder(order));
            }
        },
        [dispatch]
    );

    useEffect(() => {
        // Check to see if we've just arrived here from a successful order.
        if (confirmationOrder && accessToken) {
            // Tell the system to generate a new order
            generateOrder(accessToken);

            // Reset the cart state.
            dispatch(resetCart());

            // Reset the checkout data
            dispatch(resetCheckoutDetails());

            // Checkout has finished loading by moving to the confirmation.
            dispatch(setCheckoutLoading(false));
        }
    }, [confirmationOrder, accessToken]);

    if (!confirmationOrder) {
        return null;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto max-w-xxl">
                <div className="flex flex-row space-x-4 pt-4">
                    <div className="flex-1">
                        <ConfirmationDetails />
                    </div>
                    <div className="flex-1">
                        <Summary isConfirmation={true} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ConfirmationPage;
