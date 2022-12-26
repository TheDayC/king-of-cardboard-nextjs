import React from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';

import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import selector from './selector';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';
import PageWrapper from '../../components/PageWrapper';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    return {
        props: {
            hasSession: Boolean(session),
        },
    };
};

interface CheckoutPageProps {
    hasSession: boolean;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ hasSession }) => {
    const { currentStep } = useSelector(selector);

    return (
        <PageWrapper
            title="Checkout - King of Cardboard"
            description="Checkout your favourite products with King of Cardboard."
        >
            <div className="flex flex-col w-full">
                <Steps currentStep={currentStep} />
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

export default CheckoutPage;
