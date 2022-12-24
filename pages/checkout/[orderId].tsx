import React from 'react';
import { GetServerSideProps } from 'next';

import PageWrapper from '../../components/PageWrapper';
import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {},
    };
};

export const CheckoutByOrderId: React.FC = () => {
    return (
        <PageWrapper title="Checkout - King of Cardboard" description="Checkout your order with King of Cardboard.">
            <div className="flex flex-col w-full">
                <Steps currentStep={0} />
                <div className="container mx-auto max-w-xxl">
                    <div className="flex flex-col-reverse lg:flex-row lg:space-x-8">
                        <div className="flex flex-col w-full lg:w-3/5">
                            <Customer />
                            <Delivery />
                            <Payment />
                        </div>
                        <div className="flex-1 my-4 lg:my-0">
                            <Summary isConfirmation={false} />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default CheckoutByOrderId;
