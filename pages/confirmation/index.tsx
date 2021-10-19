import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import { setCheckoutLoading } from '../../store/slices/global';
import { resetCart } from '../../store/slices/cart';
import { resetCheckoutDetails } from '../../store/slices/checkout';
import selector from './selector';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { confirmationOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        // Check to see if we've just arrived here from a successful order.
        if (confirmationOrder) {
            // Reset the cart state.
            dispatch(resetCart());

            // Reset the checkout data
            dispatch(resetCheckoutDetails());

            // Checkout has finished loading by moving to the confirmation.
            dispatch(setCheckoutLoading(false));
        } else {
            router.push('/');
        }
    }, []);

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
