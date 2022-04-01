import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import PageWrapper from '../../components/PageWrapper';
import { setCheckoutLoading } from '../../store/slices/global';
import { setShouldCreateOrder } from '../../store/slices/cart';
import { resetCheckoutDetails } from '../../store/slices/checkout';
import selector from './selector';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { confirmationOrderNumber, accessToken } = useSelector(selector);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check to see if we've just arrived here from a successful order.
        if (confirmationOrderNumber) {
            // Reset the checkout data
            dispatch(resetCheckoutDetails());

            // Tell the system to generate a new order - this also resets the cart.
            dispatch(setShouldCreateOrder(true));

            // Checkout has finished loading by moving to the confirmation.
            dispatch(setCheckoutLoading(false));
        }
    }, [confirmationOrderNumber, accessToken, dispatch]);

    if (!confirmationOrderNumber) {
        return null;
    }

    return (
        <PageWrapper title="Confirmation - King of Cardboard" description={null}>
            <div className="flex flex-col w-full pt-4 lg:flex-row lg:space-x-4">
                <div className="flex-1 mb-4">
                    <ConfirmationDetails />
                </div>
                <div className="flex-1 p-2 lg:p-0">
                    <Summary isConfirmation={true} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ConfirmationPage;
