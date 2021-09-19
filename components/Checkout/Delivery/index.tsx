import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, toNumber } from 'lodash';
import { useForm } from 'react-hook-form';

import { initCommerceClient } from '../../../utils/commerce';
import selector from './selector';
import { ShippingMethods } from '../../../types/commerce';
import { setCurrentStep, setShippingMethod } from '../../../store/slices/checkout';
import { DeliveryDetails } from '../../../types/checkout';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, shippingMethod } = useSelector(selector);
    const [shippingMethodsInt, setShippingMethodsInt] = useState<ShippingMethods[] | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;

    const getFirstSku = useCallback(async () => {
        if (accessToken) {
            const cl = initCommerceClient(accessToken);

            // const sku = await Sku.first();
            const fetchedShippingMethods = await cl.shipping_methods.list();

            if (fetchedShippingMethods) {
                const methodKeys = Object.keys(fetchedShippingMethods)
                    .filter((m) => m !== 'meta')
                    .map((m) => toNumber(m));
                const methods: ShippingMethods[] = [];
                methodKeys.forEach((mK: number) => {
                    const {
                        id,
                        name,
                        currency_code,
                        formatted_price_amount,
                        formatted_price_amount_for_shipment,
                        price_amount_cents,
                        price_amount_float,
                        price_amount_for_shipment_cents,
                        price_amount_for_shipment_float,
                        type,
                    } = fetchedShippingMethods[mK];

                    methods.push({
                        id,
                        name,
                        currency_code,
                        formatted_price_amount,
                        formatted_price_amount_for_shipment,
                        price_amount_cents,
                        price_amount_float,
                        price_amount_for_shipment_cents,
                        price_amount_for_shipment_float,
                        type,
                    });
                });

                setShippingMethodsInt(methods);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        getFirstSku();
    }, [getFirstSku]);

    const handleSelectShippingMethod = (data: DeliveryDetails) => {
        const shippingMethodId = get(data, 'shippingMethod', null);

        dispatch(setShippingMethod(shippingMethodId));
        dispatch(setCurrentStep(2));
    };

    const handleEdit = () => {
        dispatch(setCurrentStep(1));
    };

    return (
        <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
            <div className="flex">
                <div className={`collapse collapse-${isCurrentStep ? 'open' : 'closed'}`}>
                    <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                        {!hasErrors && !isCurrentStep ? 'Delivery - Edit' : 'Delivery'}
                    </h3>
                    <div className="collapse-content">
                        {shippingMethodsInt &&
                            shippingMethodsInt.map((method) => (
                                <div className="form-control" key={`method-${method.id}`}>
                                    <label className="label cursor-pointer">
                                        <span className="label-text">{method.name}</span>
                                    </label>
                                    <input
                                        type="radio"
                                        className="radio"
                                        value={method.id}
                                        checked={Boolean(shippingMethod)}
                                        {...register('shippingMethod', {
                                            required: { value: true, message: 'Required' },
                                        })}
                                    />
                                </div>
                            ))}
                        <button
                            type="submit"
                            className={`btn${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}`}
                        >
                            Payment
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Delivery;
