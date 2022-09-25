import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';

import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import { CreateToken } from '../../types/commerce';
import selector from './selector';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';
import PageWrapper from '../../components/PageWrapper';
import { createToken } from '../../utils/auth';
import { setAccessToken, setExpires } from '../../store/slices/global';

export const getServerSideProps: GetServerSideProps = async () => {
    const accessToken = await createToken();

    return {
        props: {
            errorCode: !accessToken ? 500 : null,
            accessToken,
        },
    };
};

interface CheckoutProps {
    accessToken: CreateToken;
}

export const CheckoutPage: React.FC<CheckoutProps> = ({ accessToken }) => {
    const dispatch = useDispatch();
    const { currentStep } = useSelector(selector);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

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
                            <Customer accessToken={accessToken.token} />
                            <Delivery accessToken={accessToken.token} />
                            <Payment accessToken={accessToken.token} />
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
