import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import Header from '../../components/Header';
import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import { setCheckoutLoading } from '../../store/slices/global';
import { resetCart, setShouldCreateOrder } from '../../store/slices/cart';
import { resetCheckoutDetails } from '../../store/slices/checkout';
import selector from './selector';
import Footer from '../../components/Footer';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { confirmationOrderNumber, accessToken } = useSelector(selector);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check to see if we've just arrived here from a successful order.
        if (confirmationOrderNumber) {
            // Reset the cart state.
            dispatch(resetCart());

            // Reset the checkout data
            dispatch(resetCheckoutDetails());

            // Tell the system to generate a new order
            dispatch(setShouldCreateOrder(true));

            // Checkout has finished loading by moving to the confirmation.
            dispatch(setCheckoutLoading(false));
        }
    }, [confirmationOrderNumber, accessToken, dispatch]);

    if (!confirmationOrderNumber) {
        return null;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="flex flex-col w-full bg-primary-content">
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
            </div>
            <Footer />
        </React.Fragment>
    );
};

export default ConfirmationPage;
