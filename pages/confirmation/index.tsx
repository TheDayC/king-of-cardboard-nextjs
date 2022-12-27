import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import PageWrapper from '../../components/PageWrapper';
import { resetCheckoutDetails, setIsCheckoutLoading } from '../../store/slices/checkout';
import selector from './selector';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const { orderNumber } = useSelector(selector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (orderNumber) {
            // Checkout has finished loading by moving to the confirmation.
            dispatch(setIsCheckoutLoading(true));

            // Reset the checkout data
            dispatch(resetCheckoutDetails());
        }
    }, [orderNumber, dispatch]);

    if (!orderNumber) {
        return null;
    }

    return (
        <PageWrapper
            title="Confirmation - King of Cardboard"
            description="Your product confirmation from King of Cardboard."
        >
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
