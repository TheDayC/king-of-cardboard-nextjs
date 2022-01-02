import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import Header from '../../components/Header';
import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import { setCheckoutLoading } from '../../store/slices/global';
import { createCLOrder, resetCart } from '../../store/slices/cart';
import { resetCheckoutDetails } from '../../store/slices/checkout';
import selector from './selector';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { confirmationOrder, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const isGuest = !Boolean(session);

    // Create a brand new order and set the id in the store.
    const generateOrder = useCallback(
        async (accessToken: string) => {
            dispatch(createCLOrder({ accessToken, isGuest }));
        },
        [dispatch, isGuest]
    );

    useEffect(() => {
        // Check to see if we've just arrived here from a successful order.
        if (confirmationOrder && accessToken) {
            // Reset the cart state.
            dispatch(resetCart());

            // Reset the checkout data
            dispatch(resetCheckoutDetails());

            // Tell the system to generate a new order
            generateOrder(accessToken);

            // Checkout has finished loading by moving to the confirmation.
            dispatch(setCheckoutLoading(false));
        }
    }, [confirmationOrder, accessToken, dispatch, generateOrder]);

    if (!confirmationOrder) {
        return null;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto max-w-xxl">
                <div className="flex flex-col lg:flex-row lg:space-x-4 pt-4">
                    <div className="flex-1 mb-4">
                        <ConfirmationDetails />
                    </div>
                    <div className="flex-1 p-2 lg:p-0">
                        <Summary isConfirmation={true} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ConfirmationPage;
