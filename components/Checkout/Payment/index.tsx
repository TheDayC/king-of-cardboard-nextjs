import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement } from '@stripe/react-stripe-js';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import Method from './Method';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, paymentMethods } = useSelector(selector);
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

    const onSubmit = (data: any) => {};

    const createOrder = (gatewayType: string) => {
        // console.log("🚀 ~ file: index.tsx ~ line 200 ~ createOrder ~ gatewayType", gatewayType)
    };
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
                                <button
                                    className="btn btn-primary"
                                    key={`payment-method-${method.name}`}
                                    onClick={() => createOrder(method.payment_source_type || '')}
                                >
                                    {method.name}
                                </button>
                            </React.Fragment>
                        ))}
                </form>
            </div>
        </div>
    );
};

export default Payment;
