import React from 'react';

import Header from '../../components/Header';
import Steps from '../../components/Checkout/Steps';
import CustomerDetails from '../../components/Checkout/CustomerDetails';

export const CheckoutPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-8">
                <div className="flex flex-col">
                    <Steps currentStep={0} />
                    <CustomerDetails />
                </div>
            </div>
        </React.Fragment>
    );
};

export default CheckoutPage;
