import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch } from 'react-redux';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { fetchOrder } from '../../store/slices/cart';
import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const orderId = safelyParse(context, 'query.orderId', parseAsString, null);
    const accessToken = await createToken();

    return {
        props: {
            orderId,
            accessToken,
        },
    };
};

interface CheckoutByOrderIdProps {
    orderId: string;
    accessToken: CreateToken;
}

export const CheckoutByOrderId: React.FC<CheckoutByOrderIdProps> = ({ orderId, accessToken }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    useEffect(() => {
        if (orderId && accessToken.token) {
            dispatch(fetchOrder({ accessToken: accessToken.token, orderId }));
        }
    }, [dispatch, orderId, accessToken.token]);

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
