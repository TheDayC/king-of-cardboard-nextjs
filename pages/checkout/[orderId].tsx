import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { fetchOrder } from '../../store/slices/cart';
import selector from './selector';
import Steps from '../../components/Checkout/Steps';
import Customer from '../../components/Checkout/Customer';
import Delivery from '../../components/Checkout/Delivery';
import Payment from '../../components/Checkout/Payment';
import Summary from '../../components/Checkout/Summary';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const orderId = safelyParse(context, 'query.orderId', parseAsString, null);

    return {
        props: {
            orderId,
        },
    };
};

interface CheckoutByOrderIdProps {
    orderId: string;
}

export const CheckoutByOrderId: React.FC<CheckoutByOrderIdProps> = ({ orderId }) => {
    const dispatch = useDispatch();
    const { accessToken } = useSelector(selector);

    useEffect(() => {
        if (orderId && accessToken) {
            dispatch(fetchOrder({ accessToken, orderId }));
        }
    }, [dispatch, orderId, accessToken]);

    return (
        <PageWrapper title="Checkout - King of Cardboard" description={null}>
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
