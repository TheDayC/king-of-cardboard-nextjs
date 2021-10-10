import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement } from '@stripe/react-stripe-js';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import Method from './Method';
import { createPaymentSource } from '../../../utils/commerce';
import { get } from 'lodash';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, paymentMethods, accessToken, orderId } = useSelector(selector);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 2;

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handlePayment = useCallback(async (accessToken: string, orderId: string, paymentSourceType: string) => {
        const clientSecret = await createPaymentSource(accessToken, orderId, paymentSourceType);
        console.log('🚀 ~ file: index.tsx ~ line 30 ~ handlePayment ~ clientSecret', clientSecret);
    }, []);

    const onSubmit = useCallback(
        (data: any) => {
            const methodId = get(data, 'paymentMethod', null);
            if (accessToken && orderId && methodId) {
                const paymentMethodData = paymentMethods.find((pM) => pM.id === methodId) || null;

                if (paymentMethodData) {
                    handlePayment(accessToken, orderId, paymentMethodData.payment_source_type);
                }
            }
        },
        [accessToken, orderId, handlePayment, paymentMethods]
    );

    return (
        <div className={`collapse collapse-${isCurrentStep ? 'open' : 'closed'}`}>
            <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                {!isCurrentStep ? 'Payment - Edit' : 'Payment'}
            </h3>
            <div className="collapse-content">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {paymentMethods &&
                        paymentMethods.map((method) => (
                            <React.Fragment key={`card-entry-${method.name}`}>
                                <Method
                                    id={method.id}
                                    name={method.name}
                                    sourceType={method.payment_source_type}
                                    defaultChecked={paymentMethods.length < 2 ? true : false}
                                    register={register}
                                />
                            </React.Fragment>
                        ))}

                    <button className="btn btn-primary">Place Order</button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
