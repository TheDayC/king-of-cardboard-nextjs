import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../../components/Header';
import Steps from '../../../components/Checkout/Steps';
import Summary from '../../../components/Checkout/Summary';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Complete from '../../../components/Checkout/Complete';
import selector from './selector';
import { getPayPalPaymentIdByOrder } from '../../../utils/checkout';
import { setCheckoutLoading } from '../../../store/slices/global';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
import { isArrayOfErrors } from '../../../utils/typeguards';

interface CompleteOrderPageProps {
    orderId: string;
    payerId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const orderId = safelyParse(context, 'query.orderId', parseAsString, null);
    const payerId = safelyParse(context, 'query.PayerID', parseAsString, null);

    // Check top see if we have an orderId in the query or return a redirect.
    if (orderId && payerId) {
        return {
            props: {
                orderId,
                payerId,
            },
        };
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/cart',
            },
        };
    }
};

export const CompleteOrderPage: React.FC<CompleteOrderPageProps> = ({ orderId, payerId }) => {
    const { accessToken, checkoutLoading } = useSelector(selector);
    const dispatch = useDispatch();
    const [paymentId, setPaymentId] = useState<string | null>(null);

    const fetchPaymentData = async (token: string) => {
        const res = await getPayPalPaymentIdByOrder(token, orderId);
        if (isArrayOfErrors(res)) {
            res.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            setPaymentId(res);
        }

        dispatch(setCheckoutLoading(false));
    };

    useEffect(() => {
        if (accessToken) {
            dispatch(setCheckoutLoading(true));
            fetchPaymentData(accessToken);
        }
    }, [accessToken]);

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-2 md:p-4 lg:p-8">
                <div className="flex flex-col">
                    <Steps currentStep={3} />
                    <div className="container mx-auto max-w-xxl">
                        <div className="flex flex-col-reverse lg:flex-row lg:space-x-8">
                            <div className="flex flex-col w-full lg:w-3/5">
                                <Complete paymentId={paymentId} payerId={payerId} orderId={orderId} />
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

export default CompleteOrderPage;
