import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { CommerceAuthProps } from '../../types/commerce';
import Summary from '../../components/Checkout/Summary';
import ConfirmationDetails from '../../components/ConfirmationDetails';
import PageWrapper from '../../components/PageWrapper';
import { resetCheckoutDetails } from '../../store/slices/checkout';

export const ConfirmationPage: React.FC<CommerceAuthProps> = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetCheckoutDetails());
    }, [dispatch]);

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
                    <Summary isConfirmation />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ConfirmationPage;
