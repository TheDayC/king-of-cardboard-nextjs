import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import { DeliveryDetails, MergedShipments } from '../../../types/checkout';
import {
    getDeliveryLeadTimes,
    getShipments,
    mergeMethodsAndLeadTimes,
    updateShipmentMethod,
} from '../../../utils/checkout';
import { fetchOrder } from '../../../store/slices/cart';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, shippingMethod, order } = useSelector(selector);
    const [shippingMethodsInt, setShippingMethodsInt] = useState<MergedShipments[] | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;

    const fetchAllShipments = useCallback(
        async (accessToken: string, orderId: string) => {
            if (accessToken && orderId) {
                const shippingMethods = await getShipments(accessToken, orderId);
                const deliveryLeadTimes = await getDeliveryLeadTimes(accessToken);

                if (shippingMethods && deliveryLeadTimes) {
                    const mergedMethods = mergeMethodsAndLeadTimes(shippingMethods.shippingMethods, deliveryLeadTimes);

                    mergedMethods.forEach((method) => {
                        if (method.leadTimes) {
                            updateShipmentMethod(accessToken, method.id, method.leadTimes.id);
                        }
                    });

                    // dispatch(fetchOrder(true));
                    // setShippingMethodsInt();
                }
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (accessToken && order) {
            fetchAllShipments(accessToken, order.id);
        }
    }, [accessToken, order, fetchAllShipments]);

    const handleSelectShippingMethod = async (data: DeliveryDetails) => {
        /* const chosenId = get(data, 'shippingMethod', null);

        if (chosenId && shippingMethodsInt && accessToken) {
            const foundShipment = shippingMethodsInt.find(method => method.id === chosenId);

            if (foundShipment && foundShipment.leadTimes) {
                const hasUpdated = await updateShipmentMethod(accessToken, foundShipment.id, foundShipment.leadTimes.id);

                if (hasUpdated) {
                    dispatch(setCurrentStep(2));
                    dispatch(fetchOrder(true));
                }
            }
        } */
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(1));
        }
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
                                        <span className="label-text">
                                            {method.name}
                                            {method.formatted_price_amount_for_shipment}
                                            {method.leadTimes &&
                                                `Available in ${method.leadTimes.minDays} - ${method.leadTimes.maxDays} days.`}
                                        </span>
                                    </label>
                                    <input
                                        type="radio"
                                        className="radio"
                                        value={method.id}
                                        defaultChecked={Boolean(shippingMethod)}
                                        {...register('shippingMethod', {
                                            required: { value: true, message: 'Required' },
                                        })}
                                    />
                                </div>
                            ))}
                        <button
                            type="submit"
                            className={`btn-sm btn-outline${
                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'
                            }`}
                        >
                            Back to Details
                        </button>
                        <button
                            type="submit"
                            className={`btn-sm${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}`}
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
