import React from 'react';
import { useSelector } from 'react-redux';

import Header from '../../components/Header';
import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import { CommerceAuthProps } from '../../types/commerce';
import selector from './selector';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';

export const CheckoutPage: React.FC<CommerceAuthProps> = () => {
    const { currentStep } = useSelector(selector);

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-2 md:p-4 lg:p-8">
                <div className="flex flex-col">
                    <Steps currentStep={currentStep} />
                    <div className="container mx-auto max-w-xxl">
                        <div className="flex flex-col lg:flex-row lg:space-x-8">
                            <div className="flex flex-col w-3/5">
                                <Customer />
                                <Delivery />
                                <Payment />
                            </div>
                            <div className="flex-1 p-2 lg:p-0">
                                <Summary isConfirmation={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CheckoutPage;
